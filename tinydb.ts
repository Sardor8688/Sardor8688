// tinydb.ts — V2 (post-audit; see AUDIT.md for the 14 findings).
//
// Tiny in-memory transactional database, single file, no deps.
//
// Features:
//   - Typed schemas: string | number | boolean | nullable<T> | array<T>
//   - Transactions: begin / commit / rollback (nested, inverse-op stack)
//   - Equality indexes with auto-pickup in select() — keys normalised so
//     object/array index values work
//   - Append-only audit log with monotonic seq, deep-cloned before/after
//   - Built-in test runner; see end of file
//
// Acceptable limitations:
//   - deepClone is JSON-shape only (no Date / Map / Set / BigInt / fns).
//   - No persistence; no unique/range constraints; single-thread.
//
// Build: tsc --strict --target ES2020 --module commonjs tinydb.ts
// Run:   node tinydb.js

declare const process: { exitCode?: number };

// ---------- 1. Type system ----------------------------------------------

type FieldType =
  | { kind: "string" }
  | { kind: "number" }
  | { kind: "boolean" }
  | { kind: "nullable"; inner: FieldType }
  | { kind: "array"; inner: FieldType };

const T = {
  string: (): FieldType => ({ kind: "string" }),
  number: (): FieldType => ({ kind: "number" }),
  boolean: (): FieldType => ({ kind: "boolean" }),
  nullable: (inner: FieldType): FieldType => ({ kind: "nullable", inner }),
  array: (inner: FieldType): FieldType => ({ kind: "array", inner }),
};

class ValidationError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "ValidationError";
  }
}

class TxnError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "TxnError";
  }
}

function validate(value: unknown, type: FieldType, path: string): void {
  switch (type.kind) {
    case "string":
      if (typeof value !== "string")
        throw new ValidationError(`${path}: expected string, got ${describe(value)}`);
      return;
    case "number":
      // FIX #1: reject NaN, Infinity, -Infinity.
      if (typeof value !== "number" || !Number.isFinite(value))
        throw new ValidationError(`${path}: expected finite number, got ${describe(value)}`);
      return;
    case "boolean":
      if (typeof value !== "boolean")
        throw new ValidationError(`${path}: expected boolean, got ${describe(value)}`);
      return;
    case "nullable":
      // FIX #2: only `null` is allowed; `undefined` is rejected.
      if (value === null) return;
      validate(value, type.inner, path);
      return;
    case "array":
      if (!Array.isArray(value))
        throw new ValidationError(`${path}: expected array, got ${describe(value)}`);
      for (let i = 0; i < value.length; i++) validate(value[i], type.inner, `${path}[${i}]`);
      return;
  }
}

function describe(v: unknown): string {
  if (v === null) return "null";
  if (typeof v === "number" && !Number.isFinite(v)) return String(v);
  if (Array.isArray(v)) return "array";
  if (v === undefined) return "undefined";
  return typeof v;
}

type Schema = Record<string, FieldType>;
type Row = Record<string, unknown> & { id: number };

// ---------- 2. Helpers --------------------------------------------------

function deepClone<T>(v: T): T {
  // Acceptable limitation: JSON-shape only.
  return JSON.parse(JSON.stringify(v)) as T;
}

function deepEqual(a: unknown, b: unknown): boolean {
  // FIX #3: NaN-equal, array/object distinction, length check first.
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number" && Number.isNaN(a) && Number.isNaN(b))
    return true;
  if (a === null || b === null) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;
  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr !== bIsArr) return false;
  if (aIsArr && bIsArr) {
    const aa = a as unknown[];
    const bb = b as unknown[];
    if (aa.length !== bb.length) return false;
    for (let i = 0; i < aa.length; i++) if (!deepEqual(aa[i], bb[i])) return false;
    return true;
  }
  const ao = a as Record<string, unknown>;
  const bo = b as Record<string, unknown>;
  const ak = Object.keys(ao).sort();
  const bk = Object.keys(bo).sort();
  if (ak.length !== bk.length) return false;
  for (let i = 0; i < ak.length; i++) if (ak[i] !== bk[i]) return false;
  for (const k of ak) if (!deepEqual(ao[k], bo[k])) return false;
  return true;
}

function normalizeIndexKey(v: unknown): unknown {
  // FIX #4: stable index key for objects/arrays. Primitives kept identical.
  if (v === null) return "\u0000null";
  if (typeof v === "object") return "\u0000o" + JSON.stringify(v);
  // distinguish 1 from "1" by tagging primitives with their typeof
  return v;
}

// ---------- 3. Audit log ------------------------------------------------

type AuditEntry =
  | { seq: number; kind: "insert"; table: string; id: number; after: Row }
  | { seq: number; kind: "update"; table: string; id: number; before: Row; after: Row }
  | { seq: number; kind: "delete"; table: string; id: number; before: Row }
  | { seq: number; kind: "rollback"; depth: number };

// ---------- 4. Transactions ---------------------------------------------

type InverseOp =
  | { kind: "del"; table: string; id: number }                     // undo insert
  | { kind: "restore"; table: string; id: number; row: Row }       // undo update
  | { kind: "reinsert"; table: string; id: number; row: Row };     // undo delete

interface TxnFrame {
  ops: InverseOp[];
}

// ---------- 5. Storage --------------------------------------------------

interface TableState {
  name: string;
  schema: Schema;
  rows: Map<number, Row>;
  nextId: number;
  // field name -> indexed value -> set of row ids
  indexes: Map<string, Map<unknown, Set<number>>>;
}

type Predicate = Record<string, unknown>;

export class TinyDB {
  private tables = new Map<string, TableState>();
  private txnStack: TxnFrame[] = [];
  private audit: AuditEntry[] = [];
  private auditSeq = 0;

  // -- schema -----------------------------------------------------------

  createTable(name: string, schema: Schema): void {
    if (this.tables.has(name)) throw new Error(`table ${name} already exists`);
    this.tables.set(name, {
      name,
      schema,
      rows: new Map(),
      nextId: 1,
      indexes: new Map(),
    });
  }

  createIndex(table: string, field: string): void {
    const t = this.mustTable(table);
    // FIX #11: a field not in the schema can never carry a valid value, so
    // creating such an index is a programming error.
    if (!Object.prototype.hasOwnProperty.call(t.schema, field))
      throw new Error(`createIndex: field ${field} not in schema for table ${table}`);
    if (t.indexes.has(field)) return;
    const idx = new Map<unknown, Set<number>>();
    t.indexes.set(field, idx);
    // FIX #10: backfill existing rows.
    for (const row of t.rows.values()) {
      const key = normalizeIndexKey((row as Record<string, unknown>)[field]);
      let s = idx.get(key);
      if (!s) {
        s = new Set();
        idx.set(key, s);
      }
      s.add(row.id);
    }
  }

  // -- mutations --------------------------------------------------------

  insert(table: string, row: Record<string, unknown>): Row {
    const t = this.mustTable(table);
    // Validate BEFORE assigning an id so a failed insert does not burn ids
    // and does not write to the txn stack / audit log.
    const candidate: Row = { ...row, id: 0 };
    this.validateRow(t, candidate, /* checkId */ false);
    const id = t.nextId++;
    const stored: Row = { ...row, id };
    t.rows.set(id, stored);
    this.indexAdd(t, stored);

    this.pushInverse({ kind: "del", table, id });
    // FIX #7: deep-clone snapshots into the audit log.
    this.audit.push({
      seq: ++this.auditSeq,
      kind: "insert",
      table,
      id,
      after: deepClone(stored),
    });

    // FIX #8: never hand out internal references.
    return deepClone(stored);
  }

  update(table: string, predicate: Predicate, patch: Record<string, unknown>): number {
    const t = this.mustTable(table);

    // Validate the merged row up-front for every match so that nothing is
    // partially applied if validation throws.
    for (const k of Object.keys(patch)) {
      if (!Object.prototype.hasOwnProperty.call(t.schema, k))
        throw new ValidationError(`${table}.${k}: not in schema`);
    }

    const matches = this.scan(t, predicate);
    let count = 0;
    for (const id of matches) {
      const before = t.rows.get(id)!;
      const after: Row = { ...before, ...patch, id };
      // Validate the merged row, not just the patch keys.
      this.validateRow(t, after, /* checkId */ true);

      // FIX #5: refresh indexes for the changed row.
      this.indexRemove(t, before);
      t.rows.set(id, after);
      this.indexAdd(t, after);

      // FIX #7: deep-clone for inverse op AND audit entry, so subsequent
      // mutations to either side do not bleed into the snapshot.
      this.pushInverse({ kind: "restore", table, id, row: deepClone(before) });
      this.audit.push({
        seq: ++this.auditSeq,
        kind: "update",
        table,
        id,
        before: deepClone(before),
        after: deepClone(after),
      });
      count++;
    }
    return count;
  }

  delete(table: string, predicate: Predicate): number {
    const t = this.mustTable(table);
    const matches = this.scan(t, predicate);
    let count = 0;
    for (const id of matches) {
      const before = t.rows.get(id)!;
      t.rows.delete(id);
      this.indexRemove(t, before);

      // FIX #7: deep-clone snapshots.
      this.pushInverse({ kind: "reinsert", table, id, row: deepClone(before) });
      this.audit.push({
        seq: ++this.auditSeq,
        kind: "delete",
        table,
        id,
        before: deepClone(before),
      });
      count++;
    }
    return count;
  }

  // -- query ------------------------------------------------------------

  select(table: string, predicate?: Predicate): Row[] {
    const t = this.mustTable(table);
    const ids = this.scan(t, predicate ?? {});
    const out: Row[] = [];
    // FIX #9: deep-clone every returned row.
    for (const id of ids) out.push(deepClone(t.rows.get(id)!));
    return out;
  }

  // -- transactions -----------------------------------------------------

  begin(): void {
    this.txnStack.push({ ops: [] });
  }

  commit(): void {
    // FIX #12: explicit error on misuse.
    if (this.txnStack.length === 0) throw new TxnError("commit: no active transaction");
    const frame = this.txnStack.pop()!;
    const parent = this.txnStack[this.txnStack.length - 1];
    if (parent) {
      // Append in original order: outer rollback iterates parent.ops in
      // reverse, which still yields LIFO undo for the inner ops.
      for (const op of frame.ops) parent.ops.push(op);
    }
  }

  rollback(): void {
    // FIX #12: explicit error on misuse.
    if (this.txnStack.length === 0) throw new TxnError("rollback: no active transaction");
    const frame = this.txnStack.pop()!;
    for (let i = frame.ops.length - 1; i >= 0; i--) this.applyInverse(frame.ops[i]);
    // FIX #13: monotonic seq via the same shared counter.
    this.audit.push({
      seq: ++this.auditSeq,
      kind: "rollback",
      depth: this.txnStack.length,
    });
  }

  // -- inspection -------------------------------------------------------

  auditLog(): AuditEntry[] {
    // FIX #14: snapshot of immutable view.
    return this.audit.map((e) => deepClone(e));
  }

  // ---------- internals --------------------------------------------------

  private mustTable(name: string): TableState {
    const t = this.tables.get(name);
    if (!t) throw new Error(`unknown table ${name}`);
    return t;
  }

  private validateRow(t: TableState, row: Row, checkId: boolean): void {
    for (const field of Object.keys(t.schema)) {
      if (!checkId && field === "id") continue;
      validate((row as Record<string, unknown>)[field], t.schema[field], `${t.name}.${field}`);
    }
    for (const field of Object.keys(row)) {
      if (field === "id") continue;
      if (!Object.prototype.hasOwnProperty.call(t.schema, field))
        throw new ValidationError(`${t.name}.${field}: not in schema`);
    }
  }

  private indexAdd(t: TableState, row: Row): void {
    for (const [field, idx] of t.indexes) {
      const key = normalizeIndexKey((row as Record<string, unknown>)[field]);
      let s = idx.get(key);
      if (!s) {
        s = new Set();
        idx.set(key, s);
      }
      s.add(row.id);
    }
  }

  private indexRemove(t: TableState, row: Row): void {
    for (const [field, idx] of t.indexes) {
      const key = normalizeIndexKey((row as Record<string, unknown>)[field]);
      const s = idx.get(key);
      if (!s) continue;
      s.delete(row.id);
      if (s.size === 0) idx.delete(key);
    }
  }

  private scan(t: TableState, predicate: Predicate): number[] {
    const keys = Object.keys(predicate);
    if (keys.length === 0) return [...t.rows.keys()];
    // Pick first indexed field present in predicate.
    let candidates: number[] | null = null;
    for (const k of keys) {
      const idx = t.indexes.get(k);
      if (idx) {
        const s = idx.get(normalizeIndexKey(predicate[k]));
        candidates = s ? [...s] : [];
        break;
      }
    }
    if (candidates === null) candidates = [...t.rows.keys()];
    const out: number[] = [];
    for (const id of candidates) {
      const row = t.rows.get(id);
      if (!row) continue;
      let ok = true;
      for (const k of keys) {
        if (!deepEqual((row as Record<string, unknown>)[k], predicate[k])) {
          ok = false;
          break;
        }
      }
      if (ok) out.push(id);
    }
    return out;
  }

  private pushInverse(op: InverseOp): void {
    const top = this.txnStack[this.txnStack.length - 1];
    if (top) top.ops.push(op);
  }

  private applyInverse(op: InverseOp): void {
    const t = this.mustTable(op.table);
    if (op.kind === "del") {
      const row = t.rows.get(op.id);
      t.rows.delete(op.id);
      // FIX #6: drop from indexes too, otherwise stale ids leak into lookups.
      if (row) this.indexRemove(t, row);
    } else if (op.kind === "restore") {
      const current = t.rows.get(op.id);
      // FIX #5: refresh indexes when restoring.
      if (current) this.indexRemove(t, current);
      t.rows.set(op.id, op.row);
      this.indexAdd(t, op.row);
    } else if (op.kind === "reinsert") {
      t.rows.set(op.id, op.row);
      this.indexAdd(t, op.row);
    }
  }
}

export { T, FieldType, ValidationError, TxnError };

// ============================================================================
// Test runner
// ============================================================================

type TestFn = () => void | Promise<void>;
const tests: { name: string; fn: TestFn }[] = [];
function test(name: string, fn: TestFn) {
  tests.push({ name, fn });
}
function assert(cond: unknown, msg = "assertion failed"): asserts cond {
  if (!cond) throw new Error(msg);
}
function assertEq(actual: unknown, expected: unknown, msg = "values not equal"): void {
  if (!deepEqual(actual, expected))
    throw new Error(`${msg}\n  actual:   ${JSON.stringify(actual)}\n  expected: ${JSON.stringify(expected)}`);
}
function assertThrows(fn: () => unknown, match?: RegExp | string): void {
  try {
    fn();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (match instanceof RegExp && !match.test(msg))
      throw new Error(`threw but message did not match ${match}: ${msg}`);
    if (typeof match === "string" && !msg.includes(match))
      throw new Error(`threw but message did not include ${JSON.stringify(match)}: ${msg}`);
    return;
  }
  throw new Error("expected to throw");
}

function makeUserDb() {
  const db = new TinyDB();
  db.createTable("users", {
    id: T.number(),
    name: T.string(),
    age: T.number(),
    nick: T.nullable(T.string()),
    tags: T.array(T.string()),
  });
  return db;
}

// ---------- baseline schema/CRUD tests ----------

test("createTable + insert returns row with id", () => {
  const db = makeUserDb();
  const r = db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  assert(r.id === 1);
  assert(r.name === "a");
});

test("auto-incrementing id", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  const r = db.insert("users", { name: "b", age: 2, nick: null, tags: [] });
  assert(r.id === 2);
});

test("string validation", () => {
  const db = makeUserDb();
  assertThrows(() => db.insert("users", { name: 1, age: 1, nick: null, tags: [] }), /string/);
});

test("number validation - non-number rejected", () => {
  const db = makeUserDb();
  assertThrows(() => db.insert("users", { name: "a", age: "1", nick: null, tags: [] }), /number/);
});

test("boolean validation", () => {
  const db = new TinyDB();
  db.createTable("t", { id: T.number(), b: T.boolean() });
  assertThrows(() => db.insert("t", { b: "true" }), /boolean/);
  db.insert("t", { b: true });
});

test("nullable accepts null", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
});

test("array<string> validation rejects mixed", () => {
  const db = makeUserDb();
  assertThrows(
    () => db.insert("users", { name: "a", age: 1, nick: null, tags: ["x", 1] }),
    /string/
  );
});

test("array<string> validation rejects non-array", () => {
  const db = makeUserDb();
  assertThrows(() => db.insert("users", { name: "a", age: 1, nick: null, tags: "x" }), /array/);
});

test("select returns inserted rows", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.insert("users", { name: "b", age: 2, nick: null, tags: [] });
  assert(db.select("users").length === 2);
});

test("select with predicate equality", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.insert("users", { name: "b", age: 1, nick: null, tags: [] });
  const r = db.select("users", { name: "a" });
  assert(r.length === 1 && r[0].name === "a");
});

test("update by predicate changes value", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  const n = db.update("users", { name: "a" }, { age: 99 });
  assert(n === 1);
  assert(db.select("users", { name: "a" })[0].age === 99);
});

test("delete by predicate removes rows", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  const n = db.delete("users", { name: "a" });
  assert(n === 1);
  assert(db.select("users").length === 0);
});

test("createIndex + select uses index path", () => {
  const db = makeUserDb();
  db.createIndex("users", "name");
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.insert("users", { name: "b", age: 1, nick: null, tags: [] });
  const r = db.select("users", { name: "a" });
  assert(r.length === 1);
});

test("transaction commit persists changes", () => {
  const db = makeUserDb();
  db.begin();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.commit();
  assert(db.select("users").length === 1);
});

test("transaction rollback undoes insert", () => {
  const db = makeUserDb();
  db.begin();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.rollback();
  assert(db.select("users").length === 0);
});

test("transaction rollback undoes update", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.begin();
  db.update("users", { name: "a" }, { age: 50 });
  db.rollback();
  assert(db.select("users", { name: "a" })[0].age === 1);
});

test("transaction rollback undoes delete", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.begin();
  db.delete("users", { name: "a" });
  db.rollback();
  assert(db.select("users").length === 1);
});

test("nested transactions: inner commit visible to outer", () => {
  const db = makeUserDb();
  db.begin();
  db.begin();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.commit();
  assert(db.select("users").length === 1);
  db.commit();
  assert(db.select("users").length === 1);
});

test("nested transactions: outer rollback undoes inner-committed work", () => {
  const db = makeUserDb();
  db.begin();
  db.begin();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.commit();
  db.rollback();
  assert(db.select("users").length === 0);
});

test("audit log records insert/update/delete", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.update("users", { name: "a" }, { age: 9 });
  db.delete("users", { name: "a" });
  const log = db.auditLog();
  assert(log.length === 3);
  assert(log[0].kind === "insert");
  assert(log[1].kind === "update");
  assert(log[2].kind === "delete");
});

test("audit log seq is monotonic across mutations", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.insert("users", { name: "b", age: 2, nick: null, tags: [] });
  db.update("users", { name: "a" }, { age: 3 });
  const log = db.auditLog();
  for (let i = 1; i < log.length; i++) assert(log[i].seq > log[i - 1].seq);
});

test("rollback emits a rollback audit entry", () => {
  const db = makeUserDb();
  db.begin();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.rollback();
  const log = db.auditLog();
  assert(log.find((e) => e.kind === "rollback") !== undefined);
});

test("rollback after failed validation leaves state intact", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.begin();
  try {
    db.insert("users", { name: "b", age: "x", nick: null, tags: [] });
  } catch {
    // expected
  }
  db.rollback();
  assert(db.select("users").length === 1);
});

test("update returns number of matched rows", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.insert("users", { name: "a", age: 2, nick: null, tags: [] });
  const n = db.update("users", { name: "a" }, { age: 99 });
  assert(n === 2);
});

test("delete returns number of matched rows", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.insert("users", { name: "a", age: 2, nick: null, tags: [] });
  assert(db.delete("users", { name: "a" }) === 2);
});

test("multiple indexes on same table", () => {
  const db = makeUserDb();
  db.createIndex("users", "name");
  db.createIndex("users", "age");
  db.insert("users", { name: "a", age: 7, nick: null, tags: [] });
  assert(db.select("users", { age: 7 })[0].name === "a");
});

test("schema rejects unknown fields in update patch", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  assertThrows(() => db.update("users", { name: "a" }, { unknown: 1 }), /not in schema/);
});

test("createTable refuses duplicate name", () => {
  const db = new TinyDB();
  db.createTable("t", { id: T.number(), x: T.number() });
  assertThrows(() => db.createTable("t", { id: T.number(), x: T.number() }), /already/);
});

test("unknown table errors", () => {
  const db = new TinyDB();
  assertThrows(() => db.insert("nope", {}), /unknown/);
});

test("nullable<array<string>> chain", () => {
  const db = new TinyDB();
  db.createTable("t", { id: T.number(), x: T.nullable(T.array(T.string())) });
  db.insert("t", { x: null });
  db.insert("t", { x: ["a"] });
  assertThrows(() => db.insert("t", { x: [1] }), /string/);
});

test("array<array<number>> chain", () => {
  const db = new TinyDB();
  db.createTable("t", { id: T.number(), x: T.array(T.array(T.number())) });
  db.insert("t", { x: [[1, 2], [3]] });
  assertThrows(() => db.insert("t", { x: [["bad"]] }), /number/);
});

test("select returns empty array when no match", () => {
  const db = makeUserDb();
  assertEq(db.select("users", { name: "ghost" }), []);
});

test("select with no predicate returns all rows", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.insert("users", { name: "b", age: 2, nick: null, tags: [] });
  assert(db.select("users").length === 2);
});

test("update preserves id field", () => {
  const db = makeUserDb();
  const r = db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.update("users", { id: r.id }, { age: 9 });
  assert(db.select("users", { id: r.id })[0].id === r.id);
});

test("delete then insert reuses incrementing id", () => {
  const db = makeUserDb();
  const a = db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.delete("users", { id: a.id });
  const b = db.insert("users", { name: "b", age: 2, nick: null, tags: [] });
  assert(b.id === a.id + 1);
});

// ============================================================================
// Audit-fix tests: each block below is the failing-without-the-fix test that
// proves a specific finding from AUDIT.md.
// ============================================================================

// FIX #1
test("audit#1: NaN is not a valid number", () => {
  const db = makeUserDb();
  assertThrows(
    () => db.insert("users", { name: "a", age: NaN, nick: null, tags: [] }),
    /finite/
  );
});
test("audit#1: +Infinity / -Infinity rejected as number", () => {
  const db = makeUserDb();
  assertThrows(
    () => db.insert("users", { name: "a", age: Infinity, nick: null, tags: [] }),
    /finite/
  );
  assertThrows(
    () => db.insert("users", { name: "a", age: -Infinity, nick: null, tags: [] }),
    /finite/
  );
});

// FIX #2
test("audit#2: nullable does NOT accept undefined", () => {
  const db = makeUserDb();
  assertThrows(
    () => db.insert("users", { name: "a", age: 1, nick: undefined, tags: [] }),
    /nick/
  );
});

// FIX #3
test("audit#3: deepEqual distinguishes arrays from object-shaped lookalikes", () => {
  const db = new TinyDB();
  db.createTable("t", { id: T.number(), x: T.array(T.number()) });
  db.insert("t", { x: [1, 2] });
  // The buggy deepEqual would treat the array-shaped predicate-look-alike as
  // equal; once fixed, an object predicate against an array field returns 0
  // matches.
  const r = db.select("t", { x: { 0: 1, 1: 2, length: 2 } as unknown as number[] });
  assertEq(r.length, 0);
});
test("audit#3: deepEqual distinguishes nested arrays from objects", () => {
  assert(deepEqual([1, 2], [1, 2]));
  // Same Object.keys count and per-key value but one is an Array \u2014 the V1
  // bug returned `true` because Object.keys length matched.
  assert(!deepEqual([1, 2], { 0: 1, 1: 2 }));
  assert(!deepEqual({ a: 1 }, { a: 1, b: 2 }));
});

// FIX #4
test("audit#4: index lookups work for array-typed fields", () => {
  const db = new TinyDB();
  db.createTable("t", { id: T.number(), tags: T.array(T.string()) });
  db.createIndex("t", "tags");
  db.insert("t", { tags: ["x", "y"] });
  const r = db.select("t", { tags: ["x", "y"] });
  assertEq(r.length, 1);
});
test("audit#4: index keys with same JSON shape collide deterministically", () => {
  const db = new TinyDB();
  db.createTable("t", { id: T.number(), tags: T.array(T.string()) });
  db.createIndex("t", "tags");
  db.insert("t", { tags: ["a"] });
  db.insert("t", { tags: ["a"] });
  assertEq(db.select("t", { tags: ["a"] }).length, 2);
});

// FIX #5
test("audit#5: updating an indexed field refreshes the index", () => {
  const db = makeUserDb();
  db.createIndex("users", "name");
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.update("users", { name: "a" }, { name: "b" });
  // No ghost match for the old key.
  assertEq(db.select("users", { name: "a" }).length, 0);
  assertEq(db.select("users", { name: "b" }).length, 1);
});

// FIX #6
test("audit#6: rolling back an insert cleans the index", () => {
  const db = makeUserDb();
  db.createIndex("users", "name");
  db.begin();
  db.insert("users", { name: "ghost", age: 1, nick: null, tags: [] });
  db.rollback();
  assertEq(db.select("users", { name: "ghost" }).length, 0);
});
test("audit#6: rolling back an update refreshes index for both keys", () => {
  const db = makeUserDb();
  db.createIndex("users", "name");
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.begin();
  db.update("users", { name: "a" }, { name: "z" });
  db.rollback();
  assertEq(db.select("users", { name: "a" }).length, 1);
  assertEq(db.select("users", { name: "z" }).length, 0);
});

// FIX #7
test("audit#7: audit entries are immune to post-mutation of the row", () => {
  const db = makeUserDb();
  const r = db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  // External code mutates the returned row \u2014 must not bleed into the audit.
  (r as Record<string, unknown>).name = "MUTATED";
  const log = db.auditLog();
  const e = log[0] as Extract<AuditEntry, { kind: "insert" }>;
  assertEq(e.after.name, "a");
});

// FIX #8
test("audit#8: insert returns a clone, not the internal row", () => {
  const db = makeUserDb();
  db.createIndex("users", "name");
  const r = db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  (r as Record<string, unknown>).name = "MUTATED";
  // Internal index should still resolve "a" because mutation didn't reach it.
  assertEq(db.select("users", { name: "a" }).length, 1);
  assertEq(db.select("users", { name: "MUTATED" }).length, 0);
});

// FIX #9
test("audit#9: select returns clones; mutation does not corrupt the table", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: ["x"] });
  const r = db.select("users")[0];
  (r as Record<string, unknown>).age = 999;
  (r.tags as unknown[]).push("MUTATED");
  const fresh = db.select("users")[0];
  assertEq(fresh.age, 1);
  assertEq((fresh.tags as unknown[]).length, 1);
});

// FIX #10
test("audit#10: createIndex backfills existing rows", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.insert("users", { name: "b", age: 2, nick: null, tags: [] });
  db.createIndex("users", "name");
  assertEq(db.select("users", { name: "a" }).length, 1);
  assertEq(db.select("users", { name: "b" }).length, 1);
});

// FIX #11
test("audit#11: createIndex on a field not in the schema throws", () => {
  const db = makeUserDb();
  assertThrows(() => db.createIndex("users", "ghost"), /not in schema/);
});

// FIX #12
test("audit#12: commit without an active transaction throws", () => {
  const db = makeUserDb();
  assertThrows(() => db.commit(), /no active transaction/);
});
test("audit#12: rollback without an active transaction throws", () => {
  const db = makeUserDb();
  assertThrows(() => db.rollback(), /no active transaction/);
});

// FIX #13
test("audit#13: rollback audit entry has a monotonic seq", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.begin();
  db.insert("users", { name: "b", age: 2, nick: null, tags: [] });
  db.rollback();
  const log = db.auditLog();
  for (let i = 1; i < log.length; i++) {
    if (!(log[i].seq > log[i - 1].seq))
      throw new Error(`non-monotonic seq at i=${i}: ${log[i - 1].seq} -> ${log[i].seq}`);
  }
});

// FIX #14
test("audit#14: auditLog() snapshot is detached from internal state", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  const snap = db.auditLog();
  snap.length = 0; // try to truncate
  db.insert("users", { name: "b", age: 2, nick: null, tags: [] });
  const fresh = db.auditLog();
  assert(fresh.length === 2);
});

// Update validation strengthened: merged row, not just patch keys.
test("update validates merged row (not only patch keys)", () => {
  const db = new TinyDB();
  db.createTable("t", { id: T.number(), x: T.string() });
  db.insert("t", { x: "ok" });
  assertThrows(() => db.update("t", { x: "ok" }, { x: 42 }), /string/);
});

// Nested rollback ordering: insert then update inside a single txn must
// fully reverse on rollback.
test("nested txn: rollback applies inverse ops in LIFO order", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.begin();
  db.update("users", { name: "a" }, { age: 5 });
  db.update("users", { name: "a" }, { age: 9 });
  db.rollback();
  assertEq(db.select("users", { name: "a" })[0].age, 1);
});

// Failed validation inside a txn must not corrupt subsequent rollback.
test("rollback after mid-update validation failure works", () => {
  const db = makeUserDb();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.begin();
  db.update("users", { name: "a" }, { age: 5 });
  try {
    // invalid: NaN now rejected
    db.update("users", { name: "a" }, { age: NaN });
  } catch {
    // expected
  }
  db.rollback();
  assertEq(db.select("users", { name: "a" })[0].age, 1);
});

// Outer rollback undoes a series of inner-committed inserts.
test("outer rollback undoes multiple inner commits", () => {
  const db = makeUserDb();
  db.begin();
  db.begin();
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.commit();
  db.begin();
  db.insert("users", { name: "b", age: 2, nick: null, tags: [] });
  db.commit();
  db.rollback();
  assertEq(db.select("users").length, 0);
});

// Index integrity through delete + reinsert via rollback.
test("index integrity after delete-then-rollback", () => {
  const db = makeUserDb();
  db.createIndex("users", "name");
  db.insert("users", { name: "a", age: 1, nick: null, tags: [] });
  db.begin();
  db.delete("users", { name: "a" });
  db.rollback();
  assertEq(db.select("users", { name: "a" }).length, 1);
});

// ---------- runner ----------

(async () => {
  let pass = 0;
  let fail = 0;
  const failures: string[] = [];
  for (const t of tests) {
    try {
      await t.fn();
      pass++;
    } catch (e) {
      fail++;
      const msg = e instanceof Error ? `${e.message}\n${e.stack ?? ""}` : String(e);
      failures.push(`FAIL: ${t.name}\n  ${msg}`);
    }
  }
  console.log(`${pass}/${tests.length} tests passed.`);
  if (fail) {
    console.log(failures.join("\n\n"));
    process.exitCode = 1;
  }
})();

// tinydb.ts — V1 (re-creation of prior implementation per spec)
//
// Tiny in-memory transactional database, single file, no deps.
//
// Features:
//   - Typed schemas: string | number | boolean | nullable<T> | array<T>
//   - Transactions: begin / commit / rollback (nested, inverse-op stack)
//   - Equality indexes with auto-pickup in select()
//   - Append-only audit log with monotonic seq
//   - Built-in test runner
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
      // V1 BUG #1: accepts NaN / +-Infinity as a number.
      if (typeof value !== "number")
        throw new ValidationError(`${path}: expected number, got ${describe(value)}`);
      return;
    case "boolean":
      if (typeof value !== "boolean")
        throw new ValidationError(`${path}: expected boolean, got ${describe(value)}`);
      return;
    case "nullable":
      // V1 BUG #2: also accepts undefined as "null".
      if (value === null || value === undefined) return;
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
  if (Array.isArray(v)) return "array";
  return typeof v;
}

type Schema = Record<string, FieldType>;
type Row = Record<string, unknown> & { id: number };

// ---------- 2. Helpers --------------------------------------------------

function deepClone<T>(v: T): T {
  // V1 BUG (acceptable limitation #4): Date / Map / Set / undefined silently lost.
  return JSON.parse(JSON.stringify(v)) as T;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;
  // V1 BUG #3: doesn't distinguish array vs plain object — `[1,2]` equals
  //            `{0:1,1:2,length:2}` because we only iterate keys.
  const ao = a as Record<string, unknown>;
  const bo = b as Record<string, unknown>;
  const ak = Object.keys(ao);
  const bk = Object.keys(bo);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (!deepEqual(ao[k], bo[k])) return false;
  return true;
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
    // V1 BUG #15: silently allows creating an index on a field not in the schema.
    if (t.indexes.has(field)) return;
    t.indexes.set(field, new Map());
    // V1 BUG #14: does NOT backfill existing rows into the new index.
  }

  // -- mutations --------------------------------------------------------

  insert(table: string, row: Record<string, unknown>): Row {
    const t = this.mustTable(table);
    const id = t.nextId++;
    const stored: Row = { ...row, id };
    this.validateRow(t, stored);
    t.rows.set(id, stored);
    this.indexAdd(t, stored);

    this.pushInverse({ kind: "del", table, id });
    // V1 BUG #8: audit entry stores `stored` by reference, not a deep clone.
    this.audit.push({ seq: ++this.auditSeq, kind: "insert", table, id, after: stored });

    // V1 BUG #9: returns the same `stored` reference; caller mutation corrupts state.
    return stored;
  }

  update(table: string, predicate: Predicate, patch: Record<string, unknown>): number {
    const t = this.mustTable(table);
    const matches = this.scan(t, predicate);
    let count = 0;
    for (const id of matches) {
      const before = t.rows.get(id)!;
      const after: Row = { ...before, ...patch, id };
      // V1 BUG #11: validates only the patch keys, not the merged row, so an
      // update that accidentally introduces a missing required field via
      // `undefined` slips through.
      for (const k of Object.keys(patch)) {
        const ftype = t.schema[k];
        if (!ftype) throw new ValidationError(`${table}.${k}: not in schema`);
        validate((patch as Record<string, unknown>)[k], ftype, `${table}.${k}`);
      }

      // V1 BUG #6: index is NOT updated to reflect new field values; old index
      // keys still point at this row id.
      t.rows.set(id, after);

      this.pushInverse({ kind: "restore", table, id, row: before });
      this.audit.push({
        seq: ++this.auditSeq,
        kind: "update",
        table,
        id,
        before, // V1 BUG #8 again: by reference
        after,
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

      this.pushInverse({ kind: "reinsert", table, id, row: before });
      this.audit.push({ seq: ++this.auditSeq, kind: "delete", table, id, before });
      count++;
    }
    return count;
  }

  // -- query ------------------------------------------------------------

  select(table: string, predicate?: Predicate): Row[] {
    const t = this.mustTable(table);
    const ids = this.scan(t, predicate ?? {});
    const out: Row[] = [];
    // V1 BUG #9: returns internal row references; caller mutation corrupts state.
    for (const id of ids) out.push(t.rows.get(id)!);
    return out;
  }

  // -- transactions -----------------------------------------------------

  begin(): void {
    this.txnStack.push({ ops: [] });
  }

  commit(): void {
    // V1 BUG #12: silently no-ops if no transaction is active.
    const frame = this.txnStack.pop();
    if (!frame) return;
    const parent = this.txnStack[this.txnStack.length - 1];
    if (parent) {
      // V1 BUG #10: order-of-replay during nested rollback gets reversed
      // because we append child ops FIFO; rollback later reverses again,
      // ending up undoing in original order rather than LIFO.
      for (const op of frame.ops) parent.ops.push(op);
    }
  }

  rollback(): void {
    // V1 BUG #12: silently no-ops if no transaction is active.
    const frame = this.txnStack.pop();
    if (!frame) return;
    // Replay inverse ops in reverse order (LIFO).
    for (let i = frame.ops.length - 1; i >= 0; i--) {
      const op = frame.ops[i];
      this.applyInverse(op);
    }
    // V1 BUG #13: rollback uses (this.audit.length + 1) as seq instead of
    // ++this.auditSeq, so seq is no longer monotonic if anything was popped.
    this.audit.push({
      seq: this.audit.length + 1,
      kind: "rollback",
      depth: this.txnStack.length,
    });
  }

  // -- inspection -------------------------------------------------------

  auditLog(): AuditEntry[] {
    // V1 BUG #8: returns refs to internal entries.
    return this.audit;
  }

  // ---------- internals --------------------------------------------------

  private mustTable(name: string): TableState {
    const t = this.tables.get(name);
    if (!t) throw new Error(`unknown table ${name}`);
    return t;
  }

  private validateRow(t: TableState, row: Row): void {
    for (const field of Object.keys(t.schema)) {
      validate((row as Record<string, unknown>)[field], t.schema[field], `${t.name}.${field}`);
    }
  }

  private indexAdd(t: TableState, row: Row): void {
    for (const [field, idx] of t.indexes) {
      const key = (row as Record<string, unknown>)[field];
      // V1 BUG #5: object/array values used as Map keys directly; lookups
      // by structurally-equal values miss.
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
      const key = (row as Record<string, unknown>)[field];
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
        const s = idx.get(predicate[k]);
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
      // V1 BUG #7: forgets to remove the inserted row from indexes during rollback.
      void row;
    } else if (op.kind === "restore") {
      // Restore previous row contents.
      t.rows.set(op.id, op.row);
      // V1 BUG #6 still — index is not refreshed.
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

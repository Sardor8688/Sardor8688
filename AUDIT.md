# Adversarial audit of `tinydb.ts`

The implementation reviewed is the V1 file committed at the start of this
branch. The patch landing alongside this document fixes every issue listed
below; each fix is paired with at least one failing-then-passing test.

For each finding: **Severity** is one of *bug* (incorrect behaviour against
stated spec), *edge case* (correct on the happy path but surprising at
boundaries), or *acceptable limitation* (documented & deliberate).

| #  | Area               | Finding                                                                                                  | Severity              | Fix                                                                                          |
| -- | ------------------ | -------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------- |
| 1  | Schema             | `validate` accepts `NaN`, `+Infinity`, `-Infinity` for `T.number()` (`typeof NaN === "number"`).         | bug                   | Reject any non-finite number with `Number.isFinite`.                                          |
| 2  | Schema             | `T.nullable(T.string())` also accepts `undefined`, not just `null`.                                      | bug                   | Strict `value === null` only; otherwise recurse.                                              |
| 3  | Helpers            | `deepEqual` treats `[1,2]` as equal to `{0:1,1:2,length:2}` because it iterates keys without an `Array.isArray` check. | bug                   | Branch on `Array.isArray(a) !== Array.isArray(b)` first.                                      |
| 4  | Index              | Index keys are stored as raw values, so an index on an `array<...>` or object field never matches lookups (`Map` keys compare by reference). | bug                   | Normalise keys via `JSON.stringify` for non-primitives; preserve primitive identity otherwise. |
| 5  | Index              | `update` mutates the row but never refreshes any index entry, so equality lookups return stale matches.  | bug                   | `indexRemove(before); indexAdd(after)` for every updated row.                                |
| 6  | Index / Txn        | Rollback of an insert deletes the row from the table but leaves it in every index, so the index keeps stale `id`s forever. **Observable behaviour is currently masked** because `select` filters by `t.rows.has(id)`, but it is a slow memory leak and would be exposed by any future direct-index iteration. | bug (latent leak)    | Drop from indexes on `del` inverse op.                                                        |
| 7  | Audit log          | `insert` / `update` store the row by reference in the audit log; mutating the row externally corrupts the historical entry. | bug                   | Deep-clone `before` and `after` into the audit entry.                                         |
| 8  | API surface        | `insert` returns the internal `Row` object, so callers can mutate it and silently corrupt indexes.        | bug                   | Return a deep clone.                                                                          |
| 9  | API surface        | `select` returns internal row references — same problem.                                                  | bug                   | Return deep clones.                                                                           |
| 10 | Index              | `createIndex` does not backfill existing rows, so an index built after data is loaded misses everything until the next mutation. | bug                   | Iterate `t.rows` and add each into the new index.                                             |
| 11 | Index              | `createIndex` silently accepts a field that is not in the schema, producing an index that is impossible to populate. | edge case             | Throw at index-creation time.                                                                 |
| 12 | Transactions       | `commit` and `rollback` silently no-op when the transaction stack is empty, masking real misuse.          | bug                   | Throw `TxnError` when there is no active transaction.                                         |
| 13 | Audit log          | `rollback` writes its audit entry with `seq = audit.length + 1` instead of `++auditSeq`. With the current code the two values happen to coincide (no entries are ever popped), but the divergent counter is a foot-gun the next time anyone touches audit retention. | bug (latent)          | Use the shared `++auditSeq` counter for every entry.                                          |
| 14 | API surface        | `auditLog()` returns the internal mutable array, letting callers push fake entries.                       | bug                   | Return a deep-cloned snapshot.                                                                |

## Acceptable limitations (left in, but documented)

- **`deepClone` is JSON-shape only.** `Date`, `Map`, `Set`, `BigInt`, functions, and `undefined` values inside arrays are not preserved — by design (matches the JSON-shaped data the schema accepts). Documented in the source comment.
- **No range / unique / referential constraints.** Spec asks only for primitive type validation.
- **No persistence.** Database is in-memory by design.
- **Single-thread.** No locking; multi-async overlap is the caller's responsibility.

## Verification

After patches, the exact commands requested were run on this VM on a clean
working tree:

```
$ tsc --strict --target ES2020 --module commonjs tinydb.ts
(no output, exit 0)
$ node tinydb.js
59/59 tests passed.
(exit 0)
```

To confirm the audit-fix tests are not vacuous, the V2 test suite was also
spliced onto the V1 implementation. Result:

```
44/59 tests passed.
```

The 15 failures cover 12 of the 14 audit findings (#1, #2, #3, #4, #5, #7,
#8, #9, #10, #11, #12, #14). Findings #6 and #13 are flagged as latent —
their fixes are correct, but the V1 behaviour is unobservable through the
public API because (#6) `select` filters by `t.rows.has(id)` and (#13) no
audit entries are ever popped, so `audit.length + 1` happens to equal
`++auditSeq`. Both fixes ship anyway, with regression-guard tests.


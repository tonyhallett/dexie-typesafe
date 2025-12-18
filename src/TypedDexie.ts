import type { DBTables } from "./DBTables";
import type { DexieTypedTransaction } from "./DexieTypedTransaction";
import type { TableConfigAny } from "./tableBuilder";

type TypedDexieDbTable<TDbTables extends DBTables<any>> = TDbTables &
  DexieTypedTransaction<TDbTables>;
export type TypedDexie<TConfig extends Record<string, TableConfigAny>> = TypedDexieDbTable<
  DBTables<TConfig>
>;

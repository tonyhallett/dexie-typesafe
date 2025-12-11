import type { DBTables } from "./DBTables";
import type { DexieTypedTransaction } from "./DexieTypedTransaction";
import type { TableConfigAny } from "./tableBuilder";

export type TypedDexie<TConfig extends Record<string, TableConfigAny>> =
  DBTables<TConfig> & DexieTypedTransaction<TConfig>;

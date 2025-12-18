import type { DBTables } from "./DBTables";
import type { DexieTypedTransaction } from "./DexieTypedTransaction";
import type { TableConfigAny } from "./tableBuilder";

type TypedDexieDbTable<
  TDbTables extends DBTables<any, any>,
  TInitialDb extends boolean,
> = TDbTables & DexieTypedTransaction<TDbTables, TInitialDb>;
export type TypedDexie<
  TConfig extends Record<string, TableConfigAny>,
  TInitialDb extends boolean,
> = TypedDexieDbTable<DBTables<TConfig, TInitialDb>, TInitialDb>;

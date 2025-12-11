import type {
  Dexie,
  DexieCloseEvent,
  DexieEvent,
  DexieEventSet,
  DexieOnReadyEvent,
  DexiePopulateEvent,
  DexieVersionChangeEvent,
  PromiseExtended,
  Transaction,
  TransactionMode,
} from "dexie";
import type { TableConfigAny } from "./tableBuilder";
import type { DBTables } from "./DBTables";
import type { StringKeyOf } from "./utilitytypes";

// Helper: the union of allowed argument shapes (either a table name key or a table instance)
type TableArg<TTablesMap extends Record<string, any>> =
  | StringKeyOf<TTablesMap>
  | TTablesMap[StringKeyOf<TTablesMap>];

// Extract name from a single arg
type ArgName<A> = A extends { readonly name: infer N extends string }
  ? N
  : A extends string
  ? A
  : never;

// Union of names from tuple
type ArgNames<TTables extends readonly any[]> = ArgName<TTables[number]>;

// The result: TransactionWithTables exposes only the named tables from the DBTables mapping
type TransactionWithTables<
  TConfig extends Record<string, TableConfigAny>,
  TTables extends readonly TableArg<DBTables<TConfig>>[]
> = Omit<Transaction, "table"> &
  Pick<DBTables<TConfig>, ArgNames<TTables> & StringKeyOf<DBTables<TConfig>>>;

type DexieWithoutTransactions = Omit<Dexie, "transaction" | "on">;

type TypedOn<TConfig extends Record<string, TableConfigAny>> = {
  on: DexieEventSet & {
    // DbEventFns with typed transaction for 'populate' event
    (
      eventName: "populate",
      subscriber: (trans: Transaction & DBTables<TConfig>) => any
    ): void;
    (
      eventName: "blocked",
      subscriber: (event: IDBVersionChangeEvent) => any
    ): void;
    (
      eventName: "versionchange",
      subscriber: (event: IDBVersionChangeEvent) => any
    ): void;
    (eventName: "close", subscriber: (event: Event) => any): void;

    // from DbEvents
    (
      eventName: "ready",
      subscriber: (vipDb: Dexie) => any,
      bSticky?: boolean
    ): void;
    ready: DexieOnReadyEvent;
    populate: DexiePopulateEvent; // this is old style.
    blocked: DexieEvent;
    versionchange: DexieVersionChangeEvent;
    close: DexieCloseEvent;
  };
};

// todo - suppport table array, table, table array args
type TypedTransaction<TConfig extends Record<string, TableConfigAny>> = {
  // Array form: transaction(mode, [tables], scope)
  transaction<U, TTables extends readonly TableArg<DBTables<TConfig>>[]>(
    mode: TransactionMode,
    tables: TTables,
    scope: (
      trans: TransactionWithTables<TConfig, TTables>
    ) => PromiseLike<U> | U
  ): PromiseExtended<U>;

  // Rest parameters form: transaction(mode, table1, table2, ..., scope)
  transaction<U, TTables extends readonly TableArg<DBTables<TConfig>>[]>(
    mode: TransactionMode,
    ...tablesAndScope: [
      ...TTables,
      (trans: TransactionWithTables<TConfig, TTables>) => PromiseLike<U> | U
    ]
  ): PromiseExtended<U>;
};
export type DexieTypedTransaction<
  TConfig extends Record<string, TableConfigAny>
> = DexieWithoutTransactions & TypedTransaction<TConfig> & TypedOn<TConfig>;

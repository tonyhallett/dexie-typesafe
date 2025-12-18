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
import type { DBTables } from "./DBTables";

type TableArg<TDbTables extends DBTables<any>> = keyof TDbTables | TDbTables[keyof TDbTables];

type TablesArg<TDbTables extends DBTables<any>> = readonly TableArg<TDbTables>[];

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
  TDbTables extends DBTables<any>,
  TTables extends TablesArg<TDbTables>,
> = Omit<Transaction, "table"> & Pick<TDbTables, ArgNames<TTables>>;

type DexieWithoutTransactionOnOnce = Omit<Dexie, "transaction" | "on" | "once">;

export interface DbEventFnsWithoutPopulate {
  (eventName: "blocked", subscriber: (event: IDBVersionChangeEvent) => any): void;
  (eventName: "versionchange", subscriber: (event: IDBVersionChangeEvent) => any): void;
  (eventName: "close", subscriber: (event: Event) => any): void;
}

type TypedOnOnce<TDbTables extends DBTables<any>> = {
  on: DexieEventSet &
    DbEventFnsWithoutPopulate & {
      // from DbEvents
      (eventName: "ready", subscriber: (vipDb: Dexie) => any, bSticky?: boolean): void;
      ready: DexieOnReadyEvent;

      blocked: DexieEvent;
      versionchange: DexieVersionChangeEvent;
      close: DexieCloseEvent;
    } & TypedPopulate<TDbTables>;
  once: DbEventFnsWithoutPopulate & TypedPopulate<TDbTables>;
};

type TypedPopulate<TDbTables extends DBTables<any>> = {
  // DbEventFns typed transaction for 'populate' event
  (eventName: "populate", subscriber: (trans: Transaction & TDbTables) => any): void;
  populate: DexiePopulateEvent; // this is old style.
};

// todo - suppport table array, table, table array args
type TypedTransaction<TDbTable extends DBTables<any>> = {
  // Array form: transaction(mode, [tables], scope)
  transaction<U, TTables extends TablesArg<TDbTable>>(
    mode: TransactionMode,
    tables: TTables,
    scope: (trans: TransactionWithTables<TDbTable, TTables>) => PromiseLike<U> | U,
  ): PromiseExtended<U>;

  // Rest parameters form: transaction(mode, table1, table2, ..., scope)
  transaction<U, TTables extends TablesArg<TDbTable>>(
    mode: TransactionMode,
    ...tablesAndScope: [
      ...TTables,
      (trans: TransactionWithTables<TDbTable, TTables>) => PromiseLike<U> | U,
    ]
  ): PromiseExtended<U>;
};

export type DexieTypedTransaction<TDbTables extends DBTables<any>> = DexieWithoutTransactionOnOnce &
  TypedTransaction<TDbTables> &
  TypedOnOnce<TDbTables>;

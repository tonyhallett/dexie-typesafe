import type { DBCoreTable, PromiseExtended, TableSchema, ThenShortcut } from "dexie";
import type { BulkUpdate } from "./BulkUpdate";
import type { ChangeCallback, Collection } from "./Collection";
import type {
  DexieIndexPaths,
  IndexPath,
  IndexPathForPath,
  IndexPathRegistry,
  KeyForIndexPath,
} from "./indexpaths";
import type { PrimaryKey, PrimaryKeyId, PrimaryKeyRegistry } from "./primarykey";
import type { TableHooks } from "./TableHooks";
import type { UpdateSpec } from "./UpdateSpec";
import type { UpsertSpec } from "./UpsertSpec";
import type { NoDescend, PathKeyType, PathKeyTypes } from "./utilitytypes";
import type { WhereEquality, WherePaths } from "./where";
import type {
  EqualityRegistryLookup,
  IsValidEquality,
  WhereEqualityRegistryLookup,
} from "./whereEquality";

type PathRegistry<
  TDatabase,
  TIndexPaths extends DexieIndexPaths<TDatabase>,
  TPKeyPathOrPaths,
  TPKey,
> = readonly [
  ...IndexPathRegistry<TDatabase, TIndexPaths>,
  ...PrimaryKeyRegistry<TPKeyPathOrPaths, TPKey>,
  PathKeyType<PrimaryKeyId, TPKey>,
];

/**
 * Equality-based getters mirroring Dexie's table equality APIs.
 *
 * See Dexie documentation:
 * https://dexie.org/docs/Table/Table.get()
 */
export interface TableGetEquality<TGet, TEqualityRegistryLookup extends EqualityRegistryLookup> {
  /**
   * Get a single object by an equality matcher (alias of get).
   * See: https://dexie.org/docs/Table/Table.get()
   */
  get<TEquality extends TEqualityRegistryLookup["all"][number]["equality"]>(
    equality: TEquality,
  ): IsValidEquality<
    TEqualityRegistryLookup["all"],
    TEqualityRegistryLookup["singleLookup"],
    TEquality
  > extends true
    ? PromiseExtended<TGet | undefined>
    : never;
  /**
   * Get with then-shortcut (alias of get).
   * See: https://dexie.org/docs/Table/Table.get/
   */
  get<R, TEquality extends TEqualityRegistryLookup["all"][number]["equality"]>(
    equality: TEquality,
    thenShortcut: ThenShortcut<TGet | undefined, R>,
  ): IsValidEquality<
    TEqualityRegistryLookup["all"],
    TEqualityRegistryLookup["singleLookup"],
    TEquality
  > extends true
    ? PromiseExtended<R>
    : never;

  /**
   * Alias of get using explicit naming for equality.
   * See: https://dexie.org/docs/Table/Table.get()
   */
  getEquality<TEquality extends TEqualityRegistryLookup["all"][number]["equality"]>(
    equality: TEquality,
  ): IsValidEquality<
    TEqualityRegistryLookup["all"],
    TEqualityRegistryLookup["singleLookup"],
    TEquality
  > extends true
    ? PromiseExtended<TGet | undefined>
    : never;

  /**
   * Alias of get with then-shortcut.
   * See: https://dexie.org/docs/Table/Table.get()
   */
  getEquality<R, TEquality extends TEqualityRegistryLookup["all"][number]["equality"]>(
    equality: TEquality,
    thenShortcut: ThenShortcut<TGet | undefined, R>,
  ): IsValidEquality<
    TEqualityRegistryLookup["all"],
    TEqualityRegistryLookup["singleLookup"],
    TEquality
  > extends true
    ? PromiseExtended<R>
    : never;

  /**
   * Alias of get for composite equality.
   * See: https://dexie.org/docs/Table/Table.get()
   */
  getCompositeEquality<TEquality extends TEqualityRegistryLookup["composite"][number]["equality"]>(
    equality: TEquality,
  ): IsValidEquality<
    TEqualityRegistryLookup["composite"],
    TEqualityRegistryLookup["singleLookup"],
    TEquality
  > extends true
    ? PromiseExtended<TGet | undefined>
    : never;

  /**
   * Alias of get for composite equality with then-shortcut.
   * See: https://dexie.org/docs/Table/Table.get()
   */
  getCompositeEquality<
    R,
    TEquality extends TEqualityRegistryLookup["composite"][number]["equality"],
  >(
    equality: TEquality,
    thenShortcut: ThenShortcut<TGet | undefined, R>,
  ): IsValidEquality<
    TEqualityRegistryLookup["composite"],
    TEqualityRegistryLookup["singleLookup"],
    TEquality
  > extends true
    ? PromiseExtended<R>
    : never;

  /**
   * Alias of get for single equality.
   * See: https://dexie.org/docs/Table/Table.get()
   */
  getSingleEquality<TEquality extends TEqualityRegistryLookup["single"][number]["equality"]>(
    equality: TEquality,
  ): IsValidEquality<
    TEqualityRegistryLookup["single"],
    TEqualityRegistryLookup["singleLookup"],
    TEquality
  > extends true
    ? PromiseExtended<TGet | undefined>
    : never;

  /**
   * Alias of get for single equality with then-shortcut.
   * See: https://dexie.org/docs/Table/Table.get()
   */
  getSingleEquality<R, TEquality extends TEqualityRegistryLookup["single"][number]["equality"]>(
    equality: TEquality,
    thenShortcut: ThenShortcut<TGet | undefined, R>,
  ): IsValidEquality<
    TEqualityRegistryLookup["single"],
    TEqualityRegistryLookup["singleLookup"],
    TEquality
  > extends true
    ? PromiseExtended<R>
    : never;

  /**
   * Alias of get with an equality filter.
   * See: https://dexie.org/docs/Table/Table.get()
   */
  getSingleFilterEquality<TEquality extends TEqualityRegistryLookup["single"][number]["equality"]>(
    equality: TEquality,
    equalityFilter: TEqualityRegistryLookup["equalityFilterType"],
  ): IsValidEquality<
    TEqualityRegistryLookup["single"],
    TEqualityRegistryLookup["singleLookup"],
    TEquality
  > extends true
    ? PromiseExtended<TGet | undefined>
    : never;

  /**
   * Alias of get with equality filter and then-shortcut.
   * See: https://dexie.org/docs/Table/Table.get()
   */
  getSingleFilterEquality<
    R,
    TEquality extends TEqualityRegistryLookup["single"][number]["equality"],
  >(
    equality: TEquality,
    equalityFilter: TEqualityRegistryLookup["equalityFilterType"],
    thenShortcut: ThenShortcut<TGet | undefined, R>,
  ): IsValidEquality<
    TEqualityRegistryLookup["single"],
    TEqualityRegistryLookup["singleLookup"],
    TEquality
  > extends true
    ? PromiseExtended<R>
    : never;
}

/**
 * Primary-key based getters, including `bulkGet`.
 *
 * See Dexie documentation:
 * https://dexie.org/docs/Table/Table.get()
 * https://dexie.org/docs/Table/Table.bulkGet()
 */
export interface TableGetKey<TGet, TPKey> {
  /** Get a single object by primary key. See: https://dexie.org/docs/Table/Table.get/ */
  get(key: TPKey): PromiseExtended<TGet | undefined>;
  /** Get by primary key with then-shortcut. See: https://dexie.org/docs/Table/Table.get/ */
  get<R>(key: TPKey, thenShortcut: ThenShortcut<TGet | undefined, R>): PromiseExtended<R>;
  /**
   * Fetch multiple records by primary keys.
   *
   * Dexie reference:
   * https://dexie.org/docs/Table/Table.bulkGet()
   */
  bulkGet(keys: TPKey[]): PromiseExtended<(TGet | undefined)[]>;
}

type TableGet<TGet, TPKey, TEqualityRegistryLookup extends EqualityRegistryLookup> = TableGetKey<
  TGet,
  TPKey
> &
  TableGetEquality<TGet, TEqualityRegistryLookup>;

/**
 * Core table operations and collection conversions.
 *
 * See Dexie Table and Collection docs for corresponding behaviors:
 * https://dexie.org/docs/Table/Table
 * https://dexie.org/docs/Collection/Collection
 */
export interface TableCore<
  TName extends string,
  TGet,
  TDatabase,
  TInsert,
  TPKeyPathOrPaths,
  TIndexPaths extends DexieIndexPaths<TDatabase>,
  TPKey,
  TWherePathKeyTypes extends PathKeyTypes,
  TEqualityRegistryLookup extends EqualityRegistryLookup,
  TDexie,
  TMaxDepth extends string,
> {
  db: TDexie;
  readonly name: TName;
  schema: TableSchema;
  hook: TableHooks<TDatabase, TGet, TPKey>;
  core: DBCoreTable;

  filter: ReturnType<this["toCollection"]>["and"];
  /** Alias of Collection.and: https://dexie.org/docs/Collection/Collection.and() */
  count: ReturnType<this["toCollection"]>["count"];
  /** Alias of Collection.count: https://dexie.org/docs/Collection/Collection.count() */

  offset: ReturnType<this["toCollection"]>["offset"];
  /** Alias of Collection.offset: https://dexie.org/docs/Collection/Collection.offset() */
  limit: ReturnType<this["toCollection"]>["limit"];
  /** Alias of Collection.limit: https://dexie.org/docs/Collection/Collection.limit() */

  each: ReturnType<this["toCollection"]>["each"];
  /** Alias of Collection.each: https://dexie.org/docs/Collection/Collection.each() */

  toArray: ReturnType<this["toCollection"]>["toArray"];
  /** Convert to a typed Collection. See: https://dexie.org/docs/Collection/Collection */
  toCollection(): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TPKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  /** Order by an indexed path. See: https://dexie.org/docs/Collection/Collection.orderBy() */
  orderBy<Path extends IndexPath<TDatabase, TIndexPaths[number]>>(
    index: Path,
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    KeyForIndexPath<TDatabase, IndexPathForPath<TDatabase, TIndexPaths, Path>>,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  /** Order by the primary key id. See: https://dexie.org/docs/Collection/Collection.orderBy() */
  orderBy(
    id: PrimaryKeyId,
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TPKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  /** Reverse collection order. See: https://dexie.org/docs/Collection/Collection.reverse() */
  reverse: ReturnType<this["toCollection"]>["reverse"];

  /** Delete a single record by key. See: https://dexie.org/docs/Table/Table.delete() */
  delete(key: TPKey): PromiseExtended<void>;
  /** Delete multiple records by keys. See: https://dexie.org/docs/Table/Table.bulkDelete() */
  bulkDelete(keys: TPKey[]): PromiseExtended<void>;
  /** Clear all records in the table. See: https://dexie.org/docs/Table/Table.clear() */
  clear(): PromiseExtended<void>;

  /** Update fields on a single record. See: https://dexie.org/docs/Table/Table.update() */
  update(
    key: PrimaryKey<TDatabase, TPKeyPathOrPaths>,
    changes: UpdateSpec<TDatabase, TMaxDepth>,
  ): PromiseExtended<0 | 1>;
  /** Update via change-callback on a single record. See: https://dexie.org/docs/Table/Table.update() */
  update(
    key: PrimaryKey<TDatabase, TPKeyPathOrPaths>,
    changes: ChangeCallback<TDatabase, TInsert, PrimaryKey<TDatabase, TPKeyPathOrPaths>>,
  ): PromiseExtended<0 | 1>;

  /** Bulk update multiple records. See: https://dexie.org/docs/Table/Table.bulkUpdate/ */
  bulkUpdate(
    changes: BulkUpdate<TDatabase, TPKeyPathOrPaths, TMaxDepth>[],
  ): PromiseExtended<number>;

  /*
    dexie typescript incorrectly allows T for the key
    upsert(key: TKey | T, changes: UpdateSpec<TInsertType>): PromiseExtended<boolean>;
    dexie internal typescript
    https://github.com/dexie/Dexie.js/blob/761a93313b34640cc7ea8fb550ee67f1d8610f7c/src/classes/table/table.ts#L345
    upsert(key: IndexableType, modifications: { [keyPath: string]: any; }): PromiseExtended<boolean>

    purpose of UpsertSpec is to ensure that when there is no item with key
    we can only insert an item that is valid for the table
    todo look at typing with dotted paths too
  */
  /**
   * Upsert a single record: update if it exists, otherwise insert.
   *
   * Dexie reference:
   * https://dexie.org/docs/Table/Table.upsert/
   */
  upsert(key: TPKey, spec: UpsertSpec<TDatabase, TPKeyPathOrPaths>): PromiseExtended<boolean>;
}

export type TableBase<
  TName extends string,
  TGet,
  TDatabase,
  TInsert,
  TPKeyPathOrPaths,
  TIndexPaths extends DexieIndexPaths<TDatabase>,
  TPKey,
  TDexie = any,
  TMaxDepth extends string = NoDescend,
  TWherePathKeyTypes extends PathKeyTypes = PathRegistry<
    TDatabase,
    TIndexPaths,
    TPKeyPathOrPaths,
    TPKey
  >,
  TEqualityRegistryLookup extends EqualityRegistryLookup = WhereEqualityRegistryLookup<
    TDatabase,
    TIndexPaths,
    TPKeyPathOrPaths,
    TPKey,
    TMaxDepth
  >,
> = TableCore<
  TName,
  TGet,
  TDatabase,
  TInsert,
  TPKeyPathOrPaths,
  TIndexPaths,
  TPKey,
  TWherePathKeyTypes,
  TEqualityRegistryLookup,
  TDexie,
  TMaxDepth
> &
  TableWhere<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  > &
  TableGet<TGet, TPKey, TEqualityRegistryLookup>;

type TableWhere<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TWherePathKeyTypes extends PathKeyTypes,
  TEqualityRegistryLookup extends EqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TMaxDepth extends string,
> = WherePaths<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TWherePathKeyTypes,
  TEqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  undefined,
  TMaxDepth
> &
  WhereEquality<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;

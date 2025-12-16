import type { PromiseExtended, ThenShortcut } from "dexie";
import type { UpdateSpec } from "./UpdateSpec";
import type { PathKeyTypes } from "./utilitytypes";
import type { WherePaths } from "./where";
import type { EqualityRegistryLookup } from "./whereEquality";

type Comparable =
  | number
  | string
  | Date
  | Array<any>
  | Uint8Array
  | ArrayBuffer
  | DataView;
/** Helper to detect `any`. Returns true for `any`. */
type IsAny<T> = 0 extends 1 & T ? true : false;

type DotNestedKeys<T> = T extends object
  ? {
      [K in Extract<keyof T, string>]:
        | K
        | (T[K] extends object ? `${K}.${DotNestedKeys<T[K]>}` : never);
    }[Extract<keyof T, string>]
  : string;

type DotKeysOfType<T, V> = T extends object
  ? {
      [K in Extract<keyof T, string>]: T[K] extends V
        ? K
        : T[K] extends object
        ? `${K}.${DotKeysOfType<T[K], V>}`
        : never;
    }[Extract<keyof T, string>]
  : never;

export type DotKeyComparable<TValue> = IsAny<TValue> extends true
  ? string
  : // the cmp function
    DotKeysOfType<TValue, Comparable>;

export type DotKey<T> = DotNestedKeys<T>;

export type Collection<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TKey,
  TWherePathKeyTypes extends PathKeyTypes,
  TEqualityRegistryLookup extends EqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TMaxDepth extends string
> = CollectionBase<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TKey,
  TWherePathKeyTypes,
  TEqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TMaxDepth
> & {
  or: WherePaths<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TKey,
    TMaxDepth
  >["where"];
};

export interface Cursor<TKey, TPKey> {
  key: TKey;
  primaryKey: TPKey;
}

export interface EachKeyCallback<TKey, TCursorKey, TPKey> {
  (key: TKey, cursor: Cursor<TCursorKey, TPKey>): any;
}

export interface ChangeContext<TInsert, TPKey> {
  value?: TInsert;
  primkey: TPKey;
}

/*
  Note that obj is the same as ctx.value - it is what has come from the database
  but typing ChangeContext to TInsert due to docs "Sample Replacing Object"
  if you are replacing the object then it needs to be of type TInsert
  due to deleting value property in the ChangeContext has to be optional
*/
export interface ChangeCallback<TDatabase, TInsert, TPKey> {
  (
    this: ChangeContext<TInsert, TPKey>,
    obj: TDatabase,
    ctx: ChangeContext<TInsert, TPKey>
  ): void | boolean;
}

/**
 * Typed Collection API mirroring Dexie's Collection methods.
 *
 * See Dexie Collection docs:
 * https://dexie.org/docs/Collection/Collection
 */
interface CollectionBase<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TKey,
  TWherePathKeyTypes extends PathKeyTypes,
  TEqualityRegistryLookup extends EqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TMaxDepth extends string
> {
  db: TDexie;
  /** Create a cloned collection with modified props. https://dexie.org/docs/Collection/Collection.clone() */
  clone(
    props?: Object
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;

  /** Count number of items. https://dexie.org/docs/Collection/Collection.count() */
  count(): PromiseExtended<number>;
  /** Count with then-shortcut. https://dexie.org/docs/Collection/Collection.count() */
  count<R>(thenShortcut: ThenShortcut<number, R>): PromiseExtended<R>;

  /** Convert to array of results. https://dexie.org/docs/Collection/Collection.toArray() */
  toArray(): PromiseExtended<Array<TGet>>;
  /** toArray with then-shortcut. https://dexie.org/docs/Collection/Collection.toArray() */
  toArray<R>(thenShortcut: ThenShortcut<TGet[], R>): PromiseExtended<R>;
  // is toArray and sorts that
  /** Sort results by key path. https://dexie.org/docs/Collection/Collection.sortBy() */
  sortBy(keyPath: DotKeyComparable<TGet>): PromiseExtended<TGet[]>;
  sortBy<R>(
    keyPath: DotKeyComparable<TGet>,
    thenShortcut: ThenShortcut<TGet[], R>
  ): PromiseExtended<R>;
  /*
      ***********************
      from https://dexie.org/docs/Collection/Collection.keys()
      Not possible to use keys(), uniqueKeys(), eachKey() or eachUniqueKey() when
      Collection instance is based on the primary key
    */
  // https://dexie.org/docs/Collection/Collection.each()
  /** Iterate each object. https://dexie.org/docs/Collection/Collection.each() */
  each(
    callback: (obj: TGet, cursor: Cursor<TKey, TPKey>) => any
  ): PromiseExtended<void>;
  // https://dexie.org/docs/Collection/Collection.eachKey()
  // ***************
  /** Iterate each key. https://dexie.org/docs/Collection/Collection.eachKey() */
  eachKey(callback: EachKeyCallback<TKey, TKey, TPKey>): PromiseExtended<void>;
  // https://dexie.org/docs/Collection/Collection.eachUniqueKey()
  // ***************
  /** Iterate each unique key. https://dexie.org/docs/Collection/Collection.eachUniqueKey() */
  eachUniqueKey(
    callback: EachKeyCallback<TKey, TKey, TPKey>
  ): PromiseExtended<void>;

  /** Iterate each primary key. https://dexie.org/docs/Collection/Collection.eachPrimaryKey() */
  eachPrimaryKey(
    callback: EachKeyCallback<TPKey, TKey, TPKey>
  ): PromiseExtended<void>;

  /** Get all keys. https://dexie.org/docs/Collection/Collection.keys() */
  keys(): PromiseExtended<TKey[]>;
  /** keys with then-shortcut. https://dexie.org/docs/Collection/Collection.keys() */
  keys<R>(thenShortcut: ThenShortcut<TKey[], R>): PromiseExtended<R>;
  /** Get unique keys. https://dexie.org/docs/Collection/Collection.uniqueKeys() */
  uniqueKeys(): PromiseExtended<TKey[]>;
  /** uniqueKeys with then-shortcut. https://dexie.org/docs/Collection/Collection.uniqueKeys() */
  uniqueKeys<R>(thenShortcut: ThenShortcut<TKey[], R>): PromiseExtended<R>;

  /** Get all primary keys. https://dexie.org/docs/Collection/Collection.primaryKeys() */
  primaryKeys(): PromiseExtended<TPKey[]>;
  /** primaryKeys with then-shortcut. https://dexie.org/docs/Collection/Collection.primaryKeys() */
  primaryKeys<R>(thenShortcut: ThenShortcut<TPKey[], R>): PromiseExtended<R>;

  /** Get first item. https://dexie.org/docs/Collection/Collection.first() */
  first(): PromiseExtended<TGet | undefined>;
  /** first with then-shortcut. https://dexie.org/docs/Collection/Collection.first() */
  first<R>(thenShortcut: ThenShortcut<TGet | undefined, R>): PromiseExtended<R>;
  /** Get last item. https://dexie.org/docs/Collection/Collection.last() */
  last(): PromiseExtended<TGet | undefined>;
  /** last with then-shortcut. https://dexie.org/docs/Collection/Collection.last() */
  last<R>(thenShortcut: ThenShortcut<TGet | undefined, R>): PromiseExtended<R>;
  /** Limit number of items. https://dexie.org/docs/Collection/Collection.limit() */
  limit(n: number): this;
  // https://dexie.org/docs/Collection/Collection.until()  works similar to limit
  /** Iterate until predicate; optionally include stop entry. https://dexie.org/docs/Collection/Collection.until() */
  until(
    filter: (value: TDatabase) => boolean,
    includeStopEntry?: boolean
  ): this;
  /** Skip n items. https://dexie.org/docs/Collection/Collection.offset() */
  offset(n: number): this;
  /** Alias of filter. https://dexie.org/docs/Collection/Collection.filter() */
  and: this["filter"];
  /** Filter items by predicate. https://dexie.org/docs/Collection/Collection.filter() */
  filter(filter: (item: TDatabase) => boolean): this;
  /** Return distinct results. https://dexie.org/docs/Collection/Collection.distinct() */
  distinct(): this;

  // alias
  /** Reverse order. https://dexie.org/docs/Collection/Collection.reverse() */
  reverse(): this;
  /** Alias of reverse. https://dexie.org/docs/Collection/Collection.reverse() */
  desc: this["reverse"];

  // Mutating methods
  /** Delete matched items. https://dexie.org/docs/Collection/Collection.delete() */
  delete(): PromiseExtended<number>;
  // https://dexie.org/docs/Collection/Collection.modify()
  /** Modify items via callback. https://dexie.org/docs/Collection/Collection.modify() */
  modify(
    changeCallback: ChangeCallback<TDatabase, TInsert, TPKey>
  ): PromiseExtended<number>;
  /** Modify items via update spec. https://dexie.org/docs/Collection/Collection.modify() */
  modify(changes: UpdateSpec<TDatabase, TMaxDepth>): PromiseExtended<number>;

  // https://dexie.org/docs/Collection/Collection.raw()
  /** Access raw collection with database item type. https://dexie.org/docs/Collection/Collection.raw() */
  raw(): Collection<
    TDatabase,
    TDatabase,
    TInsert,
    TPKey,
    TKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
}

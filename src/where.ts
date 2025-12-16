import type { Collection } from "./Collection";
import type { PathKeyTypes } from "./utilitytypes";
import type {
  EqualityRegistryLookup,
  KeyTypeForEquality,
} from "./whereEquality";

type KeyTypeForPath<TPathLookup extends PathKeyTypes, TPath> = Extract<
  TPathLookup[number],
  { path: TPath }
>["keyType"];

export interface WherePaths<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TWherePathKeyTypes extends PathKeyTypes,
  TEqualityRegistryLookup extends EqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TCollectionKey,
  TMaxDepth extends string
> {
  /**
   * Start a where-clause on an indexed or primary key path.
   * Dexie: https://dexie.org/docs/Table/Table.where()
   */
  where<
    TPath extends TWherePathKeyTypes[number]["path"],
    TKey extends KeyTypeForPath<TWherePathKeyTypes, TPath>
  >(
    indexOrPrimaryKeyPath: TPath
  ): WhereClause<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    CollectionKey<TCollectionKey, TKey>,
    TMaxDepth
  >;
}

export interface WhereEquality<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TWherePathKeyTypes extends PathKeyTypes,
  TEqualityRegistryLookup extends EqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TMaxDepth extends string
> {
  /** Alias of `where` using equality tokens. Dexie: https://dexie.org/docs/Table/Table.where() */
  where<
    TEquality extends TEqualityRegistryLookup["all"][number]["equality"],
    TKey = KeyTypeForEquality<
      TEqualityRegistryLookup["all"],
      TEqualityRegistryLookup["singleLookup"],
      TEquality
    >
  >(
    equality: TEquality
  ): [TKey] extends [never]
    ? never
    : Collection<
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
  /** Alias of `where`. Dexie: https://dexie.org/docs/Table/Table.where() */
  whereEquality<
    TEquality extends TEqualityRegistryLookup["all"][number]["equality"],
    TKey = KeyTypeForEquality<
      TEqualityRegistryLookup["all"],
      TEqualityRegistryLookup["singleLookup"],
      TEquality
    >
  >(
    equality: TEquality
  ): [TKey] extends [never]
    ? never
    : Collection<
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
  /** Alias of `where` for composite equality. Dexie: https://dexie.org/docs/Table/Table.where() */
  whereCompositeEquality<
    TEquality extends TEqualityRegistryLookup["composite"][number]["equality"],
    TKey = KeyTypeForEquality<
      TEqualityRegistryLookup["composite"],
      TEqualityRegistryLookup["singleLookup"],
      TEquality
    >
  >(
    equality: TEquality
  ): [TKey] extends [never]
    ? never
    : Collection<
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
  /** Alias of `where` for single equality. Dexie: https://dexie.org/docs/Table/Table.where() */
  whereSingleEquality<
    TEquality extends TEqualityRegistryLookup["single"][number]["equality"],
    TKey = KeyTypeForEquality<
      TEqualityRegistryLookup["single"],
      TEqualityRegistryLookup["singleLookup"],
      TEquality
    >
  >(
    equality: TEquality
  ): [TKey] extends [never]
    ? never
    : Collection<
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

  /** Alias of `where` with an equality filter. Dexie: https://dexie.org/docs/Table/Table.where() */
  whereSingleFilterEquality<
    TEquality extends TEqualityRegistryLookup["single"][number]["equality"],
    TKey = KeyTypeForEquality<
      TEqualityRegistryLookup["single"],
      TEqualityRegistryLookup["singleLookup"],
      TEquality
    >
  >(
    equality: TEquality,
    equalityFilter: TEqualityRegistryLookup["equalityFilterType"]
  ): [TKey] extends [never]
    ? never
    : Collection<
        TGet,
        TDatabase,
        TInsert,
        TPKey,
        KeyTypeForEquality<
          TEqualityRegistryLookup["single"],
          TEqualityRegistryLookup["singleLookup"],
          TEquality
        >,
        TWherePathKeyTypes,
        TEqualityRegistryLookup,
        TDexie,
        TPKeyPathOrPaths,
        TMaxDepth
      >;
}

type CollectionKey<TCurrent, TKey> = [TCurrent] extends [undefined]
  ? TKey
  : TCurrent | TKey;

export type PathsOf<Lookup extends PathKeyTypes> = Lookup[number]["path"];

export type WhereClause<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TKey,
  TWherePathKeyTypes extends PathKeyTypes,
  TEqualityRegistryLookup extends EqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TCollectionKey,
  TMaxDepth extends string
> = WhereClauseNonStrings<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TKey,
  TWherePathKeyTypes,
  TEqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TCollectionKey,
  TMaxDepth
> & { db: TDexie } & (Extract<TKey, string> extends never
    ? {}
    : WhereStringClause<
        TGet,
        TDatabase,
        TInsert,
        TPKey,
        TWherePathKeyTypes,
        TEqualityRegistryLookup,
        TDexie,
        TPKeyPathOrPaths,
        TCollectionKey,
        TMaxDepth
      >);
export interface WhereClauseNonStrings<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TKey,
  TWherePathKeyTypes extends PathKeyTypes,
  TEqualityRegistryLookup extends EqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TCollectionKey,
  TMaxDepth extends string
> {
  /*
    above, aboveOrEqual, below, belowOrEqual, between and equals all create dexie DBCoreKeyRange
    which become range property of the Collection ctx
    DBCoreRange is converted to IDBKeyRange 
    https://github.com/dexie/Dexie.js/blob/2a4d7b2aff3b4e9050110aa859279c1599f15d26/src/dbcore/dbcore-indexeddb.ts#L99
    The implementation of dexie's DBCoreTable converts in its query method
    https://github.com/dexie/Dexie.js/blob/2a4d7b2aff3b4e9050110aa859279c1599f15d26/src/dbcore/dbcore-indexeddb.ts#L296
    and openCursor method

    DBCoreRange is also used in 
    https://github.com/dexie/Dexie.js/blob/2a4d7b2aff3b4e9050110aa859279c1599f15d26/src/dbcore/virtual-index-middleware.ts#L95

    Relevant IndexedDB docs
    https://developer.mozilla.org/en-US/docs/Web/API/IDBIndex/getAll
    https://developer.mozilla.org/en-US/docs/Web/API/IDBKeyRange 
    https://w3c.github.io/IndexedDB/#keyrange
    https://w3c.github.io/IndexedDB/#in
    https://w3c.github.io/IndexedDB/#compare-two-keys
  */
  // https://dexie.org/docs/WhereClause/WhereClause.between()
  /**
   * Match keys between `lower` and `upper` (inclusive/exclusive by flags).
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.between()
   */
  between(
    lower: TKey,
    upper: TKey,
    includeLower?: boolean,
    includeUpper?: boolean
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  // https://dexie.org/docs/WhereClause/WhereClause.above()
  /**
   * Match keys strictly greater than `value`.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.above()
   */
  above(
    value: TKey
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  // https://dexie.org/docs/WhereClause/WhereClause.aboveOrEqual()
  /**
   * Match keys greater than or equal to `value`.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.aboveOrEqual()
   */
  aboveOrEqual(
    value: TKey
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  // https://dexie.org/docs/WhereClause/WhereClause.below()
  /**
   * Match keys strictly less than `value`.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.below()
   */
  below(
    value: TKey
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  // https://dexie.org/docs/WhereClause/WhereClause.belowOrEqual()
  /**
   * Match keys less than or equal to `key`.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.belowOrEqual()
   */
  belowOrEqual(
    key: TKey
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  // https://dexie.org/docs/WhereClause/WhereClause.equals()
  /**
   * Match keys equal to `value`.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.equals()
   */
  equals(
    value: TKey
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  // https://dexie.org/docs/WhereClause/WhereClause.anyOf()
  /**
   * Match keys equal to any of the provided values.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.anyOf()
   */
  anyOf: ValuesOf<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TCollectionKey,
    TMaxDepth
  >;
  // https://dexie.org/docs/WhereClause/WhereClause.notEqual()
  /**
   * Match keys not equal to `value`.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.notEqual()
   */
  notEqual(
    value: TKey
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  // https://dexie.org/docs/WhereClause/WhereClause.noneOf()
  /**
   * Exclude keys equal to any of the provided values.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.noneOf()
   */
  noneOf: ValuesOf<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TCollectionKey,
    TMaxDepth
  >;

  // https://dexie.org/docs/WhereClause/WhereClause.inAnyRange()
  /**
   * Match keys falling within any of the given ranges.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.inAnyRange()
   */
  inAnyRange(
    ranges: ReadonlyArray<[TKey, TKey]>,
    options?: {
      includeLowers?: boolean;
      includeUppers?: boolean;
    }
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
}

interface Prefixes<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TWherePathKeyTypes extends PathKeyTypes,
  TEqualityRegistryLookup extends EqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TCollectionKey,
  TMaxDepth extends string
> {
  (prefixes: string[]): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  (...prefixes: string[]): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
}

interface ValuesOf<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  Key,
  TWherePathKeyTypes extends PathKeyTypes,
  TEqualityRegistryLookup extends EqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TCollectionKey,
  TMaxDepth extends string
> {
  (values: readonly Key[]): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  (...values: readonly Key[]): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    Key,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
}

interface WhereStringClause<
  TGet,
  TDatabase,
  TInsert,
  TPKey,
  TWherePathKeyTypes extends PathKeyTypes,
  TEqualityRegistryLookup extends EqualityRegistryLookup,
  TDexie,
  TPKeyPathOrPaths,
  TCollectionKey,
  TMaxDepth extends string
> {
  //https://dexie.org/docs/WhereClause/WhereClause.anyOfIgnoreCase()
  /**
   * Case-insensitive match on any of the provided strings.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.anyOfIgnoreCase()
   */
  anyOfIgnoreCase: ValuesOf<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TCollectionKey,
    TMaxDepth
  >;

  // https://dexie.org/docs/WhereClause/WhereClause.equalsIgnoreCase()
  /**
   * Case-insensitive equality match for a single string.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.equalsIgnoreCase()
   */
  equalsIgnoreCase(
    value: string
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  // https://dexie.org/docs/WhereClause/WhereClause.startsWith()
  // goes throug between(str, str + maxString, true, true); where maxString = String.fromCharCode(65535);
  /**
   * Match strings starting with `prefix`.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.startsWith/
   */
  startsWith(
    prefix: string
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  // https://dexie.org/docs/WhereClause/WhereClause.startsWithIgnoreCase()
  /**
   * Case-insensitive startsWith match for `prefix`.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.startsWithIgnoreCase()
   */
  startsWithIgnoreCase(
    prefix: string
  ): Collection<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TCollectionKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TMaxDepth
  >;
  // https://dexie.org/docs/WhereClause/WhereClause.startsWithAnyOf()
  /**
   * Match strings starting with any of the given prefixes.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.startsWithAnyOf()
   */
  startsWithAnyOf: Prefixes<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TCollectionKey,
    TMaxDepth
  >;

  // https://dexie.org/docs/WhereClause/WhereClause.startsWithAnyOfIgnoreCase()
  /**
   * Case-insensitive startsWith for any of the given prefixes.
   * Dexie: https://dexie.org/docs/WhereClause/WhereClause.startsWithAnyOfIgnoreCase()
   */
  startsWithAnyOfIgnoreCase: Prefixes<
    TGet,
    TDatabase,
    TInsert,
    TPKey,
    TWherePathKeyTypes,
    TEqualityRegistryLookup,
    TDexie,
    TPKeyPathOrPaths,
    TCollectionKey,
    TMaxDepth
  >;
}

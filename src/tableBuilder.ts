import type { IndexableType, InsertType, KeyPathValue } from "dexie";
import type {
  CompoundIndexPaths,
  CompoundKeyPathsAsStr,
  DexieIndexPaths,
  MultiIndexPath,
  SingleIndexPath,
} from "./indexpaths";
import type { DeletePrimaryKeys, OptionalPrimaryKeys } from "./primarykey";
import type { Level2 } from "./UpdateSpec";
import type {
  ConstructorOf,
  IncludesNumber,
  IncludesNumberInUnion,
  IndexedDBSafeLeaf,
  NoDescend,
  NoDuplicates,
  TuplesEqual,
} from "./utilitytypes";
import type {
  AllowedKeyLeaf,
  CompoundKeyPaths,
  ValidIndexedDBKeyPath,
} from "./ValidIndexedDBKeyPaths";

interface PkConfig<TAuto extends boolean> {
  key: string | null;
  auto: TAuto;
}

export type TableConfigAny = TableConfig<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

export interface TableConfig<
  TDatabase,
  TPKeyPathOrPaths,
  TAuto extends boolean,
  TIndexPaths extends DexieIndexPaths<TDatabase>,
  TGet = TDatabase,
  TInsert = TDatabase,
  TOutboundPKey extends IndexableType = never,
  TMaxDepth extends string = NoDescend,
  TExcessDisabled extends boolean = false,
  TExcessLeaves = IndexedDBSafeLeaf
> {
  readonly pk: PkConfig<TAuto>;
  readonly indicesSchema: string;
  readonly mapToClass?: ConstructorOf<TDatabase>;
}

type IsMultiEntryArray<T> = NonNullable<T> extends readonly (infer E)[]
  ? E extends AllowedKeyLeaf
    ? true
    : false
  : false;

type MultiEntryKeyPath<T, TMaxDepth extends string> = ValidIndexedDBKeyPath<
  T,
  false,
  TMaxDepth,
  true
> extends infer P
  ? P extends string
    ? IsMultiEntryArray<KeyPathValue<T, P>> extends true
      ? P
      : never
    : never
  : never;

export type DuplicateKeysError = {
  readonly error: "Duplicate keys in compound key are not allowed";
};

export const duplicateKeysErrorInstance: DuplicateKeysError = {
  error: "Duplicate keys in compound key are not allowed",
};

export type CompoundIndexError = {
  readonly error: "Compound index is a duplicate, or has duplicate parts";
};
export const compoundIndexErrorInstance: CompoundIndexError = {
  error: "Compound index is a duplicate, or has duplicate parts",
};

type CompoundMatchesPK<TCompound, PK> = PK extends readonly any[]
  ? TCompound extends readonly any[]
    ? PK["length"] extends TCompound["length"]
      ? TCompound["length"] extends PK["length"]
        ? PK extends readonly [...TCompound]
          ? TCompound extends readonly [...PK]
            ? true
            : false
          : false
        : false
      : false
    : false
  : false;

type SingleIndexKeyPathExcludePrimaryKey<
  TDatabase,
  PkPathOrPaths,
  TAllowTypeSpecificProperties extends boolean,
  TMaxDepth extends string
> = ValidIndexedDBKeyPath<
  ApplySinglePkRemoval<TDatabase, PkPathOrPaths>,
  TAllowTypeSpecificProperties,
  TMaxDepth,
  true
>;

type MultiIndexKeyPathExcludePrimaryKey<
  TDatabase,
  PkPathOrPaths,
  TMaxDepth extends string
> = MultiEntryKeyPath<
  ApplySinglePkRemoval<TDatabase, PkPathOrPaths>,
  TMaxDepth
>;

type ApplySinglePkRemoval<TDatabase, PkPathOrPaths> = [PkPathOrPaths] extends [
  never
]
  ? TDatabase
  : PkPathOrPaths extends readonly string[]
  ? TDatabase
  : DeletePrimaryKeys<TDatabase, PkPathOrPaths>;

interface AvailableIndexMethods<TSingle, TMulti, TCompound> {
  single: TSingle;
  multi: TMulti;
  compound: TCompound;
}

type StrictCompoundIndexPaths<
  TCompoundIndexPaths extends string[],
  TIndexPaths extends DexieIndexPaths<any>
> = NoDuplicates<TCompoundIndexPaths> extends never
  ? never
  : ExcludeExistingCompound<TCompoundIndexPaths, TIndexPaths>;

export type ExcludeExistingCompound<
  TCompoundIndexPaths extends readonly string[],
  TIndexPaths extends DexieIndexPaths<any>
> = TIndexPaths extends readonly [
  infer First,
  ...infer Rest extends DexieIndexPaths<any>
]
  ? First extends CompoundIndexPaths<any, infer P extends CompoundKeyPathsAsStr>
    ? TuplesEqual<TCompoundIndexPaths, P> extends true
      ? never // exact match found → exclude
      : ExcludeExistingCompound<TCompoundIndexPaths, Rest>
    : ExcludeExistingCompound<TCompoundIndexPaths, Rest>
  : TCompoundIndexPaths; // not found → allowed

interface IndexMethods<
  TDatabase,
  PkPathOrPaths,
  Auto extends boolean,
  TIndexPaths extends DexieIndexPaths<TDatabase>,
  TGet = TDatabase,
  // stored on object - https://dexie.org/docs/inbound
  TPKeyIsInbound extends boolean = false,
  TPKeyOutbound extends IndexableType = never,
  TAllowTypeSpecificProperties extends boolean = false,
  TKeyMaxDepth extends string = NoDescend,
  TMaxDepth extends string = Level2,
  TExcessDisabled extends boolean = false,
  TExcessLeaves = IndexedDBSafeLeaf,
  TAvailableIndexMethods extends AvailableIndexMethods<
    any,
    any,
    any
  > = AvailableIndexMethods<
    SingleIndexKeyPathExcludePrimaryKey<
      TDatabase,
      PkPathOrPaths,
      TAllowTypeSpecificProperties,
      TKeyMaxDepth
    >,
    MultiIndexKeyPathExcludePrimaryKey<TDatabase, PkPathOrPaths, TKeyMaxDepth>,
    CompoundKeyPaths<
      TDatabase,
      TAllowTypeSpecificProperties,
      TKeyMaxDepth,
      true
    >
  >
> {
  /**
   * Add a single-field index for the given key path.
   *
   * Excludes the primary key path(s) from candidates to avoid redundant
   * indexing. Returns a new fluent builder state reflecting the added index
   * and removing the chosen key from available single/multi candidates.
   *
   * @template TIndexPath A valid non-PK key path in `TDatabase`.
   * @param indexPath Key path to index (e.g., "title" or "author.name").
   */
  index<TIndexPath extends TAvailableIndexMethods["single"]>(
    indexPath: TIndexPath
  ): IndexMethods<
    TDatabase,
    PkPathOrPaths,
    Auto,
    [...TIndexPaths, SingleIndexPath<TDatabase, TIndexPath>],
    TGet,
    TPKeyIsInbound,
    TPKeyOutbound,
    TAllowTypeSpecificProperties,
    TKeyMaxDepth,
    TMaxDepth,
    TExcessDisabled,
    TExcessLeaves,
    {
      single: Exclude<TAvailableIndexMethods["single"], TIndexPath>;
      multi: Exclude<TAvailableIndexMethods["multi"], TIndexPath>;
      compound: TAvailableIndexMethods["compound"];
    }
  >;
  /**
   * Add a unique single-field index for the given key path.
   *
   * Behaves like `index()` but enforces uniqueness on the indexed key.
   * Returns a new builder state reflecting the unique index.
   *
   * @see index
   */
  uniqueIndex: this["index"];
  /**
   * Add a multi-entry index for an array-valued key path.
   *
   * The path must resolve to an array type; Dexie will index each element.
   * Returns a new builder state reflecting the added multi-entry index.
   *
   * @template TIndexPath A valid array-valued key path in `TDatabase`.
   * @param indexPath Array-valued key path to multi-index.
   */
  multiIndex<TIndexPath extends TAvailableIndexMethods["multi"]>(
    indexPath: TIndexPath
  ): IndexMethods<
    TDatabase,
    PkPathOrPaths,
    Auto,
    [...TIndexPaths, MultiIndexPath<TDatabase, TIndexPath>],
    TGet,
    TPKeyIsInbound,
    TPKeyOutbound,
    TAllowTypeSpecificProperties,
    TKeyMaxDepth,
    TMaxDepth,
    TExcessDisabled,
    TExcessLeaves,
    {
      single: Exclude<TAvailableIndexMethods["single"], TIndexPath>;
      multi: Exclude<TAvailableIndexMethods["multi"], TIndexPath>;
      compound: TAvailableIndexMethods["compound"];
    }
  >;
  /**
   * Add a unique multi-entry index for an array-valued key path.
   *
   * Behaves like `multiIndex()` but enforces uniqueness across the indexed
   * entries.
   *
   * @see multiIndex
   */
  uniqueMultiIndex: this["multiIndex"];
  /**
   * Add a compound index composed of multiple key paths.
   *
   * Automatically rejects duplicates, and disallows creating a compound index
   * identical to an existing one. The compound index cannot exactly match the
   * defined primary key.
   *
   * @template TCompoundIndexPaths An array of valid non-PK key paths.
   * @param indexPaths The key paths composing the compound index.
   * @returns Either a new builder state or a `CompoundIndexError` when invalid.
   */
  compoundIndex<
    const TCompoundIndexPaths extends TAvailableIndexMethods["compound"]
  >(
    ...indexPaths: CompoundMatchesPK<
      TCompoundIndexPaths,
      PkPathOrPaths
    > extends true
      ? never
      : TCompoundIndexPaths
  ): StrictCompoundIndexPaths<TCompoundIndexPaths, TIndexPaths> extends never
    ? CompoundIndexError
    : IndexMethods<
        TDatabase,
        PkPathOrPaths,
        Auto,
        [...TIndexPaths, CompoundIndexPaths<TDatabase, TCompoundIndexPaths>],
        TGet,
        TPKeyIsInbound,
        TPKeyOutbound,
        TAllowTypeSpecificProperties,
        TKeyMaxDepth,
        TMaxDepth,
        TExcessDisabled,
        TExcessLeaves,
        {
          single: TAvailableIndexMethods["single"];
          multi: TAvailableIndexMethods["multi"];
          compound: TAvailableIndexMethods["compound"];
        }
      >;
  /**
   * Add a unique compound index composed of multiple key paths.
   *
   * Behaves like `compoundIndex()` but enforces uniqueness on the combined
   * key.
   *
   * @see compoundIndex
   */
  uniqueCompoundIndex: this["compoundIndex"];
  /**
   * Finalize the configuration and produce a `TableConfig`.
   *
   * The result can be passed to `dexieFactory()` or `upgrade()` to configure
   * object stores and indexes.
   *
   * @returns A complete table configuration reflecting the fluent setup.
   */
  build(): TableConfig<
    TDatabase,
    PkPathOrPaths,
    Auto,
    TIndexPaths,
    TGet,
    TPKeyIsInbound extends true
      ? Auto extends true
        ? OptionalPrimaryKeys<TDatabase, PkPathOrPaths>
        : TDatabase
      : TDatabase,
    TPKeyOutbound,
    TMaxDepth,
    TExcessDisabled,
    TExcessLeaves
  >;
}

const isDistinctArray = (arr: readonly any[]): boolean => {
  return Array.from(new Set(arr)).length === arr.length;
};

type InboundAutoIncrementKeyPath<
  T,
  TMaxDepth extends string
> = ValidIndexedDBKeyPath<T, false, TMaxDepth, false> extends infer K
  ? K extends string
    ? IncludesNumber<KeyPathValue<T, K>> extends true
      ? K
      : never
    : never
  : never;

function createCompoundSchemaPart(keys: string[]): string {
  return `[${keys.join("+")}]`;
}

type TableBuilder<
  TDatabase,
  TGet,
  TAllowTypeSpecificProperties extends boolean,
  TKeyMaxDepth extends string,
  TMaxDepth extends string,
  TExcessDisabled extends boolean,
  TExcessLeaves
> = {
  autoPkey<
    TPKeyPath extends InboundAutoIncrementKeyPath<TDatabase, TKeyMaxDepth>
  >(
    key: TPKeyPath
  ): IndexMethods<
    TDatabase,
    TPKeyPath,
    true,
    [],
    TGet,
    true,
    never,
    TAllowTypeSpecificProperties,
    TKeyMaxDepth,
    TMaxDepth,
    TExcessDisabled,
    TExcessLeaves
  >;

  pkey<
    TPKeyPath extends ValidIndexedDBKeyPath<
      TDatabase,
      TAllowTypeSpecificProperties,
      TKeyMaxDepth,
      false
    >
  >(
    key: TPKeyPath
  ): IndexMethods<
    TDatabase,
    TPKeyPath,
    false,
    [],
    TGet,
    true,
    never,
    TAllowTypeSpecificProperties,
    TKeyMaxDepth,
    TMaxDepth,
    TExcessDisabled,
    TExcessLeaves
  >;
  compoundPkey<
    const TCompoundKeyPaths extends CompoundKeyPaths<
      TDatabase,
      TAllowTypeSpecificProperties,
      TKeyMaxDepth,
      false
    >
  >(
    ...keys: TCompoundKeyPaths
  ): NoDuplicates<TCompoundKeyPaths> extends never
    ? DuplicateKeysError
    : IndexMethods<
        TDatabase,
        TCompoundKeyPaths,
        false,
        [],
        TGet,
        false,
        never,
        TAllowTypeSpecificProperties,
        TKeyMaxDepth,
        TMaxDepth,
        TExcessDisabled,
        TExcessLeaves
      >;

  hiddenAutoPkey<PKey extends IndexableType = number>(
    ...args: IncludesNumberInUnion<PKey> extends false
      ? PKey extends number
        ? []
        : [never] // Error: PKey must include number in union
      : []
  ): IndexMethods<
    TDatabase,
    null,
    true,
    [],
    TGet,
    false,
    PKey,
    TAllowTypeSpecificProperties,
    TKeyMaxDepth,
    TMaxDepth,
    TExcessDisabled,
    TExcessLeaves
  >;
  hiddenExplicitPkey<PKey extends IndexableType = number>(): IndexMethods<
    TDatabase,
    null,
    false,
    [],
    TGet,
    false,
    PKey,
    TAllowTypeSpecificProperties,
    TKeyMaxDepth,
    TMaxDepth,
    TExcessDisabled,
    TExcessLeaves
  >;
};

function createTableBuilder<
  TDatabase,
  TGet,
  TAllowTypeSpecificProperties extends boolean,
  TKeyMaxDepth extends string,
  TMaxDepth extends string,
  TExcessDisabled extends boolean,
  TExcessLeaves
>(
  mapToClass?: ConstructorOf<TDatabase>
): TableBuilder<
  TDatabase,
  TGet,
  TAllowTypeSpecificProperties,
  TKeyMaxDepth,
  TMaxDepth,
  TExcessDisabled,
  TExcessLeaves
> {
  const indexParts: string[] = [];

  function createIndexMethods<
    TPKeyPathOrPaths extends string | readonly string[] | null,
    TAuto extends boolean,
    TIndexPaths extends DexieIndexPaths<TDatabase>,
    TPKeyIsInbound extends boolean,
    TOutboundPKey extends IndexableType,
    TAvailableIndexMethods extends AvailableIndexMethods<
      any,
      any,
      any
    > = AvailableIndexMethods<
      SingleIndexKeyPathExcludePrimaryKey<
        TDatabase,
        TPKeyPathOrPaths,
        TAllowTypeSpecificProperties,
        TKeyMaxDepth
      >,
      MultiIndexKeyPathExcludePrimaryKey<
        TDatabase,
        TPKeyPathOrPaths,
        TKeyMaxDepth
      >,
      CompoundKeyPaths<
        TDatabase,
        TAllowTypeSpecificProperties,
        TKeyMaxDepth,
        true
      >
    >
  >(
    key: TPKeyPathOrPaths,
    auto: TAuto,
    indices: TIndexPaths,
    pkeyIsInbound: TPKeyIsInbound,
    outboundPKey: TOutboundPKey
  ): IndexMethods<
    TDatabase,
    TPKeyPathOrPaths,
    TAuto,
    TIndexPaths,
    TGet,
    TPKeyIsInbound,
    TOutboundPKey,
    TAllowTypeSpecificProperties,
    TKeyMaxDepth,
    TMaxDepth,
    TExcessDisabled,
    TExcessLeaves,
    TAvailableIndexMethods
  > {
    const addIndexPart = (part: string, unique: boolean) => {
      indexParts.push(unique ? `&${part}` : part);
    };

    function doIndex<TIndexPath extends TAvailableIndexMethods["single"]>(
      indexKey: TIndexPath,
      unique: boolean
    ) {
      addIndexPart(indexKey, unique);
      return createIndexMethods(
        key,
        auto,
        [
          ...indices,
          {
            kind: "single",
            path: indexKey,
            multi: false,
          },
        ],
        pkeyIsInbound,
        outboundPKey
      ) as IndexMethods<
        TDatabase,
        TPKeyPathOrPaths,
        TAuto,
        [...TIndexPaths, SingleIndexPath<TDatabase, TIndexPath>],
        TGet,
        TPKeyIsInbound,
        TOutboundPKey,
        TAllowTypeSpecificProperties,
        TKeyMaxDepth,
        TMaxDepth,
        TExcessDisabled,
        TExcessLeaves,
        {
          single: Exclude<TAvailableIndexMethods["single"], TIndexPath>;
          multi: TAvailableIndexMethods["multi"];
          compound: TAvailableIndexMethods["compound"];
        }
      >;
    }

    function doMulti<TIndexPath extends TAvailableIndexMethods["multi"]>(
      indexKey: TIndexPath,
      unique: boolean
    ) {
      addIndexPart(`*${indexKey}`, unique);
      return createIndexMethods(
        key,
        auto,
        [...indices, { kind: "multi", path: indexKey, multi: true }],
        pkeyIsInbound,
        outboundPKey
      ) as IndexMethods<
        TDatabase,
        TPKeyPathOrPaths,
        TAuto,
        [...TIndexPaths, MultiIndexPath<TDatabase, TIndexPath>],
        TGet,
        TPKeyIsInbound,
        TOutboundPKey,
        TAllowTypeSpecificProperties,
        TKeyMaxDepth,
        TMaxDepth,
        TExcessDisabled,
        TExcessLeaves,
        {
          single: TAvailableIndexMethods["single"];
          multi: Exclude<TAvailableIndexMethods["multi"], TIndexPath>;
          compound: TAvailableIndexMethods["compound"];
        }
      >;
    }

    function doCompound<
      const TCompoundIndexPaths extends TAvailableIndexMethods["compound"]
    >(
      unique: boolean,
      ...keys: CompoundMatchesPK<
        TCompoundIndexPaths,
        TPKeyPathOrPaths
      > extends true
        ? never
        : TCompoundIndexPaths
    ): StrictCompoundIndexPaths<TCompoundIndexPaths, TIndexPaths> extends never
      ? CompoundIndexError
      : IndexMethods<
          TDatabase,
          TPKeyPathOrPaths,
          TAuto,
          [...TIndexPaths, CompoundIndexPaths<TDatabase, TCompoundIndexPaths>],
          TGet,
          TPKeyIsInbound,
          TOutboundPKey,
          TAllowTypeSpecificProperties,
          TKeyMaxDepth,
          TMaxDepth,
          TExcessDisabled,
          TExcessLeaves,
          {
            single: TAvailableIndexMethods["single"];
            multi: TAvailableIndexMethods["multi"];
            compound: TAvailableIndexMethods["compound"];
          }
        > {
      if (isDistinctArray(keys) === false) {
        return compoundIndexErrorInstance as any;
      }
      for (const idx of indices) {
        if ((idx as any).paths !== undefined) {
          const compoundIndexPaths = idx as CompoundIndexPaths<any, any>;
          const paths = compoundIndexPaths.paths;
          if (paths.length === keys.length) {
            let allMatch = true;
            for (let i = 0; i < paths.length; i++) {
              if (paths[i] !== keys[i]) {
                allMatch = false;
                break;
              }
            }
            if (allMatch) {
              return compoundIndexErrorInstance as any;
            }
          }
        }
      }
      addIndexPart(createCompoundSchemaPart(keys), unique);
      return createIndexMethods(
        key,
        auto,
        [...indices, { kind: "compound", paths: keys }],
        pkeyIsInbound,
        outboundPKey
      ) as IndexMethods<
        TDatabase,
        TPKeyPathOrPaths,
        TAuto,
        [...TIndexPaths, CompoundIndexPaths<TDatabase, TCompoundIndexPaths>],
        TGet,
        TPKeyIsInbound,
        TOutboundPKey,
        TAllowTypeSpecificProperties,
        TKeyMaxDepth,
        TMaxDepth,
        TExcessDisabled,
        TExcessLeaves,
        {
          single: TAvailableIndexMethods["single"];
          multi: TAvailableIndexMethods["multi"];
          compound: TAvailableIndexMethods["compound"];
        }
      > as any;
    }

    return {
      index(indexKey) {
        return doIndex(indexKey, false);
      },

      uniqueIndex(indexKey) {
        return doIndex(indexKey, true);
      },
      multiIndex(indexKey) {
        return doMulti(indexKey, false);
      },
      uniqueMultiIndex(indexKey) {
        return doMulti(indexKey, true);
      },
      compoundIndex(...keys) {
        return doCompound(false, ...keys);
      },
      uniqueCompoundIndex(...keys) {
        return doCompound(true, ...keys);
      },
      build() {
        const primaryKeyPart =
          key === null
            ? null
            : typeof key === "string"
            ? key
            : createCompoundSchemaPart(key as string[]);
        const pk: PkConfig<TAuto> = { key: primaryKeyPart, auto };
        const indicesSchema = indexParts.join(",");
        if (mapToClass) {
          const mapToClasstableConfig: TableConfig<
            TDatabase,
            TPKeyPathOrPaths,
            TAuto,
            TIndexPaths,
            TGet
          > = {
            pk,
            indicesSchema,
            mapToClass,
          };
          return mapToClasstableConfig;
        }

        const tableConfig: TableConfig<
          TDatabase,
          TPKeyPathOrPaths,
          TAuto,
          TIndexPaths,
          TGet
        > = {
          pk,
          indicesSchema,
        };
        return tableConfig;
      },
    };
  }

  return {
    autoPkey<
      TPKeyPath extends InboundAutoIncrementKeyPath<TDatabase, TKeyMaxDepth>
    >(key: TPKeyPath) {
      return createIndexMethods(key, true, [] as const, true, null as never);
    },
    pkey<
      TPKeyPath extends ValidIndexedDBKeyPath<
        TDatabase,
        TAllowTypeSpecificProperties,
        TKeyMaxDepth,
        false
      >
    >(key: TPKeyPath) {
      return createIndexMethods(key, false, [] as const, true, null as never);
    },
    compoundPkey<
      const TCompoundKeyPaths extends CompoundKeyPaths<
        TDatabase,
        TAllowTypeSpecificProperties,
        TKeyMaxDepth,
        false
      >
    >(
      ...keys: TCompoundKeyPaths
    ): NoDuplicates<TCompoundKeyPaths> extends never
      ? DuplicateKeysError
      : IndexMethods<
          TDatabase,
          TCompoundKeyPaths,
          false,
          [],
          TGet,
          false,
          never,
          TAllowTypeSpecificProperties,
          TKeyMaxDepth,
          TMaxDepth,
          TExcessDisabled,
          TExcessLeaves
        > {
      if (isDistinctArray(keys) === false) {
        return duplicateKeysErrorInstance as any;
      }
      return createIndexMethods(
        keys,
        false,
        [] as const,
        true,
        null as never
      ) as any;
    },

    hiddenAutoPkey<PKey extends IndexableType = number>(
      ...args: IncludesNumberInUnion<PKey> extends false
        ? PKey extends number
          ? []
          : [never] // Error: PKey must include number in union
        : []
    ) {
      return createIndexMethods(
        null,
        true,
        [] as const,
        false,
        null as unknown as PKey
      );
    },
    hiddenExplicitPkey<PKey extends IndexableType = number>() {
      return createIndexMethods(
        null,
        false,
        [] as const,
        false,
        null as unknown as PKey
      );
    },
  };
}

/**
 * Fine-grained typing options controlling key-path behavior and excess-data checks.
 *
 * - MaxDepth: Controls traversal depth for validating key paths on the database type.
 *   Defaults to `Level2`.
 * - KeyMaxDepth: Controls traversal depth for deriving key-path types (single/multi/compound paths).
 *   Defaults to `NoDescend`.
 * - AllowTypeSpecificProperties: When `true`, allows certain leaf-type-specific properties (e.g., `string.length`,
 *   `Blob.size`) in key paths. Defaults to `false`.
 * - ExcessDataProperties: Controls excess-data-property enforcement for single-object `add`/`addObject`/`put`:
 *   - default (omitted): strict excess-property checking is enabled using IndexedDB-safe leaf types.
 *   - `true`: disables excess-property checks for single-object `add`/`addObject`/`put`.
 *   - `{ Leaves: ... }`: extends allowed leaf types while keeping strict checks enabled.
 *     Tuple aliases (`bulkAddTuple`, `bulkPutTuple`) always enforce strict checks regardless of this option.
 *
 * Usage:
 *   tableBuilder<Entity, { MaxDepth: "II"; KeyMaxDepth: "I" }>()
 *   tableBuilder<Entity, { ExcessDataProperties: true }>() // disable single-object excess checks
 *   tableBuilder<Entity, { ExcessDataProperties: { Leaves: MyLeaf } }>() // extend allowed leaves
 */
export type Options = {
  MaxDepth?: string; // default Level2
  KeyMaxDepth?: string; // default NoDescend
  AllowTypeSpecificProperties?: boolean; // default false
  /**
   * Configure enforcement of excess data properties:
   * - true: disable enforcement entirely
   * - object: extend allowed leaf types via `Leaves`
   * - undefined/false: enforce with default IndexedDB-safe leaves
   */
  ExcessDataProperties?:
    | true
    | {
        Leaves?: unknown;
      };
};

// Helpers to derive option values with defaults
type Opt_MaxDepth<TOptions extends Options> = TOptions extends {
  MaxDepth: infer M extends string;
}
  ? M
  : Level2;

type Opt_KeyMaxDepth<TOptions extends Options> = TOptions extends {
  KeyMaxDepth: infer K extends string;
}
  ? K
  : NoDescend;

type Opt_AllowTypeSpecificProperties<TOptions extends Options> =
  TOptions extends {
    AllowTypeSpecificProperties: infer A extends boolean;
  }
    ? A
    : false;

// Excess data properties options
type Opt_ExcessDisabled<TOptions extends Options> = TOptions extends {
  ExcessDataProperties: infer E;
}
  ? E extends true
    ? true
    : false
  : false;

type Opt_ExcessLeaves<TOptions extends Options> = TOptions extends {
  ExcessDataProperties: infer E;
}
  ? E extends { Leaves?: infer L }
    ? L | IndexedDBSafeLeaf
    : IndexedDBSafeLeaf
  : IndexedDBSafeLeaf;

/**
 * Start a strongly-typed table configuration for plain objects.
 *
 * Use the returned fluent API to define primary keys, single/multi/compound
 * indexes, and whether the primary key is inbound or hidden. The final
 * configuration is produced by calling `build()` and can be passed to
 * `dexieFactory()`.
 *
 * @template TDatabase The shape of the stored objects
 * @template TOptions Optional typing options. Defaults:
 * `{ MaxDepth: Level2, KeyMaxDepth: NoDescend, AllowTypeSpecificProperties: false, ExcessDataProperties: (strict single-object checks enabled) }`.
 * To disable single-object excess-property checks, set `ExcessDataProperties: true`.
 * Tuple aliases (`bulkAddTuple`, `bulkPutTuple`) always remain strict.
 * @returns A builder for configuring keys and indexes.
 */
export function tableBuilder<
  TDatabase,
  TOptions extends Options = {}
>(): TableBuilder<
  TDatabase,
  TDatabase,
  Opt_AllowTypeSpecificProperties<TOptions>,
  Opt_KeyMaxDepth<TOptions>,
  Opt_MaxDepth<TOptions>,
  Opt_ExcessDisabled<TOptions>,
  Opt_ExcessLeaves<TOptions>
> {
  return createTableBuilder<
    TDatabase,
    TDatabase,
    Opt_AllowTypeSpecificProperties<TOptions>,
    Opt_KeyMaxDepth<TOptions>,
    Opt_MaxDepth<TOptions>,
    Opt_ExcessDisabled<TOptions>,
    Opt_ExcessLeaves<TOptions>
  >();
}

/**
 * Start a table configuration mapped to a class for read operations.
 *
 * When reading from the table, entities are mapped to instances of `ctor`.
 * Insert/update types are inferred from the class instance type while
 * allowing Dexie to handle missing fields according to your key config.
 *
 * @template TGetCtor A constructor whose instances represent read entities.
 * @template TOptions Optional typing options. Defaults:
 * `{ MaxDepth: Level2, KeyMaxDepth: NoDescend, AllowTypeSpecificProperties: false, ExcessDataProperties: (strict single-object checks enabled) }`.
 * To disable single-object excess-property checks, set `ExcessDataProperties: true`.
 * Tuple aliases (`bulkAddTuple`, `bulkPutTuple`) always remain strict.
 * @param ctor The constructor used to map results to class instances.
 * @returns A builder for configuring keys and indexes.
 */
export function tableClassBuilder<
  TGetCtor extends new (...args: any) => any,
  TOptions extends Options = {}
>(
  ctor: TGetCtor
): TableBuilder<
  InsertType<InstanceType<TGetCtor>, never>,
  InstanceType<TGetCtor>,
  Opt_AllowTypeSpecificProperties<TOptions>,
  Opt_KeyMaxDepth<TOptions>,
  Opt_MaxDepth<TOptions>,
  Opt_ExcessDisabled<TOptions>,
  Opt_ExcessLeaves<TOptions>
> {
  type TEntity = InstanceType<TGetCtor>;
  type TDatabase = InsertType<TEntity, never>;

  return createTableBuilder<
    TDatabase,
    TEntity,
    Opt_AllowTypeSpecificProperties<TOptions>,
    Opt_KeyMaxDepth<TOptions>,
    Opt_MaxDepth<TOptions>,
    Opt_ExcessDisabled<TOptions>,
    Opt_ExcessLeaves<TOptions>
  >(ctor);
}

type TableClassBuilderExcluded<
  TGetCtor extends new (...args: any) => any,
  TOptions extends Options = {}
> = {
  excludedKeys<
    TExcludeProps extends keyof InstanceType<TGetCtor> & string
  >(): TableBuilder<
    InsertType<Omit<InstanceType<TGetCtor>, TExcludeProps>, never>,
    InstanceType<TGetCtor>,
    Opt_AllowTypeSpecificProperties<TOptions>,
    Opt_KeyMaxDepth<TOptions>,
    Opt_MaxDepth<TOptions>,
    Opt_ExcessDisabled<TOptions>,
    Opt_ExcessLeaves<TOptions>
  >;
};

/**
 * Start a class-mapped table builder while excluding class keys from insert type.
 *
 * Use when certain class members should not be part of the stored/inserted
 * data (e.g., computed properties, methods, or transient fields). Call
 * `excludedKeys<...>()` to specify the keys to omit before configuring keys
 * and indexes; finalize with `build()` on the returned builder.
 *
 * @template TGetCtor A constructor whose instances represent read entities.
 * @template TOptions Optional typing options. Defaults:
 * `{ MaxDepth: Level2, KeyMaxDepth: NoDescend, AllowTypeSpecificProperties: false, ExcessDataProperties: (strict single-object checks enabled) }`.
 * To disable single-object excess-property checks, set `ExcessDataProperties: true`.
 * Tuple aliases (`bulkAddTuple`, `bulkPutTuple`) always remain strict.
 * @param ctor The constructor used to map results to class instances.
 */
export function tableClassBuilderExcluded<
  TGetCtor extends new (...args: any) => any,
  TOptions extends Options = {}
>(ctor: TGetCtor): TableClassBuilderExcluded<TGetCtor, TOptions> {
  type TGet = InstanceType<TGetCtor>;
  return {
    excludedKeys<
      TExcludeProps extends keyof InstanceType<TGetCtor> & string
    >() {
      type T = Omit<TGet, TExcludeProps>;
      type TDatabase = InsertType<T, never>;

      return createTableBuilder<
        TDatabase,
        TGet,
        Opt_AllowTypeSpecificProperties<TOptions>,
        Opt_KeyMaxDepth<TOptions>,
        Opt_MaxDepth<TOptions>,
        Opt_ExcessDisabled<TOptions>,
        Opt_ExcessLeaves<TOptions>
      >(ctor);
    },
  };
}

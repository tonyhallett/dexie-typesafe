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
  TMaxDepth extends string = NoDescend
> {
  readonly pk: PkConfig<TAuto>;
  readonly indicesSchema: string;
  readonly mapToClass?: ConstructorOf<TDatabase>;
}

type IsMultiEntryArray<T> = T extends readonly (infer E)[]
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
    {
      single: Exclude<TAvailableIndexMethods["single"], TIndexPath>;
      multi: Exclude<TAvailableIndexMethods["multi"], TIndexPath>;
      compound: TAvailableIndexMethods["compound"];
    }
  >;
  uniqueIndex: this["index"];
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
    {
      single: Exclude<TAvailableIndexMethods["single"], TIndexPath>;
      multi: Exclude<TAvailableIndexMethods["multi"], TIndexPath>;
      compound: TAvailableIndexMethods["compound"];
    }
  >;
  uniqueMultiIndex: this["multiIndex"];
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
        {
          single: TAvailableIndexMethods["single"];
          multi: TAvailableIndexMethods["multi"];
          compound: TAvailableIndexMethods["compound"];
        }
      >;
  uniqueCompoundIndex: this["compoundIndex"];
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
    TMaxDepth
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
  TMaxDepth extends string
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
    TMaxDepth
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
    TMaxDepth
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
        TMaxDepth
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
    TMaxDepth
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
    TMaxDepth
  >;
};

function createTableBuilder<
  TDatabase,
  TGet,
  TAllowTypeSpecificProperties extends boolean,
  TKeyMaxDepth extends string,
  TMaxDepth extends string
>(
  mapToClass?: ConstructorOf<TDatabase>
): TableBuilder<
  TDatabase,
  TGet,
  TAllowTypeSpecificProperties,
  TKeyMaxDepth,
  TMaxDepth
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
          TKeyMaxDepth
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

export function tableBuilder<
  TDatabase,
  TMaxDepth extends string = Level2,
  TKeyMaxDepth extends string = NoDescend,
  TAllowTypeSpecificProperties extends boolean = false
>(): TableBuilder<
  TDatabase,
  TDatabase,
  TAllowTypeSpecificProperties,
  TKeyMaxDepth,
  TMaxDepth
> {
  return createTableBuilder<
    TDatabase,
    TDatabase,
    TAllowTypeSpecificProperties,
    TKeyMaxDepth,
    TMaxDepth
  >();
}

export function tableClassBuilder<
  TGetCtor extends new (...args: any) => any,
  TMaxDepth extends string = Level2,
  TKeyMaxDepth extends string = NoDescend,
  TAllowTypeSpecificProperties extends boolean = false
>(
  ctor: TGetCtor
): TableBuilder<
  InsertType<InstanceType<TGetCtor>, never>,
  InstanceType<TGetCtor>,
  TAllowTypeSpecificProperties,
  TKeyMaxDepth,
  TMaxDepth
> {
  type TEntity = InstanceType<TGetCtor>;
  type TDatabase = InsertType<TEntity, never>;

  return createTableBuilder<
    TDatabase,
    TEntity,
    TAllowTypeSpecificProperties,
    TKeyMaxDepth,
    TMaxDepth
  >(ctor);
}

type TableClassBuilderExcluded<
  TGetCtor extends new (...args: any) => any,
  TMaxDepth extends string = Level2,
  TKeyMaxDepth extends string = NoDescend,
  TAllowTypeSpecificProperties extends boolean = false
> = {
  excludedKeys<
    TExcludeProps extends keyof InstanceType<TGetCtor> & string
  >(): TableBuilder<
    InsertType<Omit<InstanceType<TGetCtor>, TExcludeProps>, never>,
    InstanceType<TGetCtor>,
    TAllowTypeSpecificProperties,
    TKeyMaxDepth,
    TMaxDepth
  >;
};

export function tableClassBuilderExcluded<
  TGetCtor extends new (...args: any) => any,
  TMaxDepth extends string = Level2,
  TKeyMaxDepth extends string = NoDescend,
  TAllowTypeSpecificProperties extends boolean = false
>(
  ctor: TGetCtor
): TableClassBuilderExcluded<
  TGetCtor,
  TMaxDepth,
  TKeyMaxDepth,
  TAllowTypeSpecificProperties
> {
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
        TAllowTypeSpecificProperties,
        TKeyMaxDepth,
        TMaxDepth
      >(ctor);
    },
  };
}

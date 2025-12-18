import type { TableInboundAutoAdd } from "./AddAutoReturnObjectAddOn";
import type { DexieIndexPaths } from "./indexpaths";
import type { PrimaryKey, PromiseExtendedPKeyOrKeys } from "./primarykey";
import type { TableInboundAutoBulkTuple } from "./TableBulkTupleAddOn";
import type { TableInboundBase } from "./TableInboundBase";

/**
 * Inbound operations with auto-increment or hidden primary keys.
 *
 * Adds convenience overloads for `bulkAdd` and `bulkPut` to return either
 * single key or all keys depending on `allKeys` option.
 *
 * See Dexie documentation:
 * https://dexie.org/docs/Table/Table.add()
 * https://dexie.org/docs/Table/Table.bulkAdd()
 * https://dexie.org/docs/Table/Table.bulkPut()
 */
export type TableInboundAuto<
  TName extends string,
  TDatabase,
  TPKeyPathOrPaths,
  TIndexPaths extends DexieIndexPaths<TDatabase>,
  TGet,
  TInsert,
  TDexie,
  TMaxDepth extends string,
  TExcessDisabled extends boolean,
  TExcessLeaves,
> = TableInboundBase<
  TName,
  TDatabase,
  TPKeyPathOrPaths,
  TIndexPaths,
  TGet,
  TInsert,
  TDexie,
  TMaxDepth,
  TExcessDisabled,
  TExcessLeaves
> &
  TableInboundAutoAdd<TDatabase, TPKeyPathOrPaths, TInsert, TExcessDisabled, TExcessLeaves> &
  TableInboundAutoBulkTuple<TDatabase, TPKeyPathOrPaths, TInsert, TExcessLeaves> & {
    /**
     * Insert multiple records with options to return all keys.
     * https://dexie.org/docs/Table/Table.bulkAdd()
     */
    bulkAdd<B extends boolean>(
      items: readonly TInsert[],
      options: {
        allKeys: B;
      },
    ): PromiseExtendedPKeyOrKeys<PrimaryKey<TDatabase, TPKeyPathOrPaths>, B>;
    /**
     * Insert or update multiple records with options to return all keys.
     * https://dexie.org/docs/Table/Table.bulkPut()
     */
    bulkPut<B extends boolean>(
      items: readonly TInsert[],
      options: { allKeys: B },
    ): PromiseExtendedPKeyOrKeys<PrimaryKey<TDatabase, TPKeyPathOrPaths>, B>;
  };

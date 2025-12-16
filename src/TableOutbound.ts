import type { IndexableType, PromiseExtended } from "dexie";
import type { DexieIndexPaths } from "./indexpaths";
import type { TableOutboundBulkTuple } from "./TableBulkTupleAddOn";
import type { TableOutboundBase } from "./TableOutboundBase";
import type { NoExcessDataProperties } from "./utilitytypes";

/**
 * Outbound operations where keys are supplied by the caller.
 *
 * See Dexie documentation:
 * https://dexie.org/docs/Table/Table.add()
 * https://dexie.org/docs/Table/Table.bulkAdd()
 * https://dexie.org/docs/Table/Table.bulkPut()
 */
export type TableOutbound<
  TName extends string,
  TDatabase,
  TInsert,
  TPKey extends IndexableType,
  TIndexPaths extends DexieIndexPaths<TDatabase>,
  TGet,
  TDexie,
  TMaxDepth extends string
> = TableOutboundBase<
  TName,
  TDatabase,
  TInsert,
  TPKey,
  TIndexPaths,
  TGet,
  TDexie,
  TMaxDepth
> &
  TableOutboundBulkTuple<TInsert, TPKey> & {
    /**
     * Insert a single record with an explicit key.
     * https://dexie.org/docs/Table/Table.add()
     */
    add<T extends TInsert>(
      item: NoExcessDataProperties<T, TInsert>,
      key: TPKey
    ): PromiseExtended<TPKey>;
    // no need for options overloads here as the keys are always provided
    /**
     * Insert multiple records with explicit keys.
     * https://dexie.org/docs/Table/Table.bulkAdd()
     */
    bulkAdd(
      items: readonly TInsert[],
      keys: readonly TPKey[]
    ): PromiseExtended<TPKey>;
    /**
     * Insert or update multiple records with explicit keys.
     * https://dexie.org/docs/Table/Table.bulkPut()
     */
    bulkPut(
      items: readonly TInsert[],
      keys: readonly TPKey[]
    ): PromiseExtended<TPKey>;
  };

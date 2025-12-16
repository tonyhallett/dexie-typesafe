import type { IndexableType, PromiseExtended } from "dexie";
import type { DexieIndexPaths } from "./indexpaths";
import type { PromiseExtendedPKeyOrKeys } from "./primarykey";
import type { TableOutboundAutoBulkTuple } from "./TableBulkTupleAddOn";
import type { TableOutboundBase } from "./TableOutboundBase";
import type { NoExcessDataProperties } from "./utilitytypes";

export type TableOutboundAuto<
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
  TableOutboundAutoBulkTuple<TInsert, TPKey> & {
    /**
     * Insert a single record with optional explicit key.
     * Dexie reference: https://dexie.org/docs/Table/Table.add()
     */
    add<T extends TInsert>(
      item: NoExcessDataProperties<T, TInsert>,
      key?: TPKey
    ): PromiseExtended<TPKey>;

    /**
     * Insert multiple records; optionally return all keys.
     * Dexie reference: https://dexie.org/docs/Table/Table.bulkAdd()
     */
    bulkAdd<B extends boolean = false>(
      items: readonly TInsert[],
      options?: {
        allKeys: B;
      }
    ): PromiseExtendedPKeyOrKeys<TPKey, B>;

    /**
     * Insert multiple records with explicit keys; optionally return all keys.
     * Dexie reference: https://dexie.org/docs/Table/Table.bulkAdd()
     */
    bulkAdd<B extends boolean = false>(
      items: readonly TInsert[],
      keys: readonly (TPKey | undefined)[],
      options?: {
        allKeys: B;
      }
    ): PromiseExtendedPKeyOrKeys<TPKey, B>;

    /**
     * Insert or update multiple records with explicit keys.
     * Dexie reference: https://dexie.org/docs/Table/Table.bulkPut()
     */
    bulkPut(
      items: readonly TInsert[],
      keys: readonly TPKey[]
    ): PromiseExtended<TPKey>;

    /**
     * Insert or update multiple records with optional keys; optionally return all keys.
     * Dexie reference: https://dexie.org/docs/Table/Table.bulkPut()
     */
    bulkPut<B extends boolean = false>(
      items: readonly TInsert[],
      keys: readonly (TPKey | undefined)[],
      options: { allKeys: B }
    ): PromiseExtendedPKeyOrKeys<TPKey, B>;
  };

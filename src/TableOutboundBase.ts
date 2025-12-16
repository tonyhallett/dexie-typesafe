import type { IndexableType, PromiseExtended } from "dexie";
import type { DexieIndexPaths } from "./indexpaths";
import type { TableBase } from "./TableBase";
import type { NoExcessDataProperties } from "./utilitytypes";

/**
 * Outbound table operations requiring explicit keys on write.
 *
 * See Dexie Table write methods:
 * https://dexie.org/docs/Table/Table.put()
 * https://dexie.org/docs/Table/Table.bulkPut()
 */
export type TableOutboundBase<
  TName extends string,
  TDatabase,
  TInsert,
  TPKey extends IndexableType,
  TIndexPaths extends DexieIndexPaths<TDatabase>,
  TGet,
  TDexie,
  TMaxDepth extends string
> = TableBase<
  TName,
  TGet,
  TDatabase,
  TInsert,
  never,
  TIndexPaths,
  TPKey,
  TDexie,
  TMaxDepth
> & {
  /*
   making the key required, although allowed by the spec to be optional for auto-increment keys
   use add without a key on TableOutboundAuto for that case
   */
  /**
   * Insert or update a single record with an explicit key.
   *
   * Dexie reference:
   * https://dexie.org/docs/Table/Table.put()
   */
  put<T extends TInsert>(
    item: NoExcessDataProperties<T, TInsert>,
    key: TPKey
  ): PromiseExtended<TPKey>;
};

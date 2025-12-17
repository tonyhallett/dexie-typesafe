import type { PromiseExtended } from "dexie";
import type { DexieIndexPaths } from "./indexpaths";
import type { PrimaryKey } from "./primarykey";
import type { TableBase } from "./TableBase";
import type { TableInboundBaseBulkTuple } from "./TableBulkTupleAddOn";
import type { MaybeNoExcess } from "./utilitytypes";

/**
 * Inbound table operations where primary keys are derived from data.
 *
 * See Dexie Table write methods:
 * https://dexie.org/docs/Table/Table.add()
 * https://dexie.org/docs/Table/Table.bulkAdd()
 * https://dexie.org/docs/Table/Table.put()
 * https://dexie.org/docs/Table/Table.bulkPut()
 */
export type TableInboundBase<
  TName extends string,
  TDatabase,
  TPKeyPathOrPaths,
  TIndexPaths extends DexieIndexPaths<TDatabase>,
  TGet,
  TInsert,
  TDexie,
  TMaxDepth extends string,
  TExcessDisabled extends boolean,
  TExcessLeaves
> = TableBase<
  TName,
  TGet,
  TDatabase,
  TInsert,
  TPKeyPathOrPaths,
  TIndexPaths,
  PrimaryKey<TDatabase, TPKeyPathOrPaths>,
  TDexie,
  TMaxDepth
> &
  TableInboundBaseBulkTuple<
    TDatabase,
    TPKeyPathOrPaths,
    TInsert,
    TExcessLeaves
  > & {
    /**
     * Insert a single record and return the derived primary key.
     * https://dexie.org/docs/Table/Table.add()
     */
    add<T extends TInsert>(
      item: MaybeNoExcess<T, TInsert, TExcessLeaves, TExcessDisabled>
    ): PromiseExtended<PrimaryKey<TDatabase, TPKeyPathOrPaths>>;
    /**
     * Insert multiple records; returns the last key (Dexie behavior).
     * https://dexie.org/docs/Table/Table.bulkAdd()
     */
    bulkAdd(
      items: readonly TInsert[]
    ): PromiseExtended<PrimaryKey<TDatabase, TPKeyPathOrPaths>>;
    /*
   making the key required, although allowed by the spec to be optional for auto-increment keys
   use add for that case
   */
    /**
     * Insert or update a single record; returns the derived primary key.
     * https://dexie.org/docs/Table/Table.put()
     */
    put<T extends TDatabase>(
      item: MaybeNoExcess<T, TDatabase, TExcessLeaves, TExcessDisabled>
    ): PromiseExtended<PrimaryKey<TDatabase, TPKeyPathOrPaths>>;
    /**
     * Insert or update multiple records; returns the last key.
     * https://dexie.org/docs/Table/Table.bulkPut()
     */
    bulkPut(
      items: readonly TInsert[]
    ): PromiseExtended<PrimaryKey<TDatabase, TPKeyPathOrPaths>>;
  };

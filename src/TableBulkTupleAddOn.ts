import Dexie, {
  type IndexableType,
  type PromiseExtended,
  type Table,
} from "dexie";
import type { PrimaryKey, PromiseExtendedPKeyOrKeys } from "./primarykey";
import type { NoExcessDataPropertiesArray } from "./utilitytypes";
import { aliasMethodTs } from "./utils";

export interface TableInboundBaseBulkTuple<
  TDatabase,
  TPKeyPathOrPaths,
  TInsert
> {
  /**
   * Alias of `bulkAdd` that accepts a tuple-array of items.
   * Dexie reference: https://dexie.org/docs/Table/Table.bulkAdd()
   */
  bulkAddTuple<TArr extends readonly [...any[]]>(
    items: TArr & NoExcessDataPropertiesArray<TArr, TInsert>
  ): PromiseExtended<PrimaryKey<TDatabase, TPKeyPathOrPaths>>;
  /**
   * Alias of `bulkPut` that accepts a tuple-array of items.
   * Dexie reference: https://dexie.org/docs/Table/Table.bulkPut()
   */
  bulkPutTuple<TArr extends readonly [...any[]]>(
    items: TArr & NoExcessDataPropertiesArray<TArr, TInsert>
  ): PromiseExtended<PrimaryKey<TDatabase, TPKeyPathOrPaths>>;
}

export interface TableInboundAutoBulkTuple<
  TDatabase,
  TPKeyPathOrPaths,
  TInsert
> {
  /**
   * Alias of `bulkAdd` with options to return all keys; accepts tuple-array.
   * Dexie reference: https://dexie.org/docs/Table/Table.bulkAdd()
   */
  bulkAddTuple<B extends boolean, TArr extends readonly [...any[]]>(
    items: TArr & NoExcessDataPropertiesArray<TArr, TInsert>,
    options: {
      allKeys: B;
    }
  ): PromiseExtendedPKeyOrKeys<PrimaryKey<TDatabase, TPKeyPathOrPaths>, B>;
  /**
   * Alias of `bulkPut` with options to return all keys; accepts tuple-array.
   * Dexie reference: https://dexie.org/docs/Table/Table.bulkPut()
   */
  bulkPutTuple<B extends boolean, TArr extends readonly [...any[]]>(
    items: TArr & NoExcessDataPropertiesArray<TArr, TInsert>,
    options: {
      allKeys: B;
    }
  ): PromiseExtendedPKeyOrKeys<PrimaryKey<TDatabase, TPKeyPathOrPaths>, B>;
}

export interface TableOutboundBulkTuple<TInsert, TPKey extends IndexableType> {
  /**
   * Alias of `bulkAdd` that accepts a tuple-array of items.
   * Dexie reference: https://dexie.org/docs/Table/Table.bulkAdd()
   */
  bulkAddTuple<TArr extends readonly [...any[]]>(
    items: TArr & NoExcessDataPropertiesArray<TArr, TInsert>,
    keys: readonly TPKey[]
  ): PromiseExtended<TPKey>;

  /**
   * Alias of `bulkPut` that accepts a tuple-array of items.
   * Dexie reference: https://dexie.org/docs/Table/Table.bulkPut()
   */
  bulkPutTuple<TArr extends readonly [...any[]]>(
    items: TArr & NoExcessDataPropertiesArray<TArr, TInsert>,
    keys: readonly TPKey[]
  ): PromiseExtended<TPKey>;
}

export interface TableOutboundAutoBulkTuple<
  TInsert,
  TPKey extends IndexableType
> {
  /**
   * Alias of `bulkAdd`; accepts tuple-array and optional allKeys option.
   * Dexie reference: https://dexie.org/docs/Table/Table.bulkAdd()
   */
  bulkAddTuple<TArr extends readonly [...any[]], B extends boolean = false>(
    items: TArr & NoExcessDataPropertiesArray<TArr, TInsert>,
    options?: {
      allKeys: B;
    }
  ): PromiseExtendedPKeyOrKeys<TPKey, B>;

  /**
   * Alias of `bulkAdd`; accepts tuple-array and explicit keys.
   * Dexie reference: https://dexie.org/docs/Table/Table.bulkAdd()
   */
  bulkAddTuple<TArr extends readonly [...any[]], B extends boolean = false>(
    items: TArr & NoExcessDataPropertiesArray<TArr, TInsert>,
    keys: readonly (TPKey | undefined)[],
    options?: {
      allKeys: B;
    }
  ): PromiseExtendedPKeyOrKeys<TPKey, B>;

  /**
   * Alias of `bulkPut`; accepts tuple-array with explicit keys.
   * Dexie reference: https://dexie.org/docs/Table/Table.bulkPut()
   */
  bulkPutTuple<TArr extends readonly [...any[]]>(
    items: TArr & NoExcessDataPropertiesArray<TArr, TInsert>,
    keys: readonly TPKey[]
  ): PromiseExtended<TPKey>;

  /**
   * Alias of `bulkPut`; accepts tuple-array with optional allKeys option.
   * Dexie reference: https://dexie.org/docs/Table/Table.bulkPut()
   */
  bulkPutTuple<TArr extends readonly [...any[]], B extends boolean = false>(
    items: TArr & NoExcessDataPropertiesArray<TArr, TInsert>,
    keys: readonly (TPKey | undefined)[],
    options: { allKeys: B }
  ): PromiseExtendedPKeyOrKeys<TPKey, B>;
}

/**
 * Adds tuple-based bulk methods as TypeScript aliases to Dexie Table APIs.
 *
 * Aliases:
 * - `bulkAddTuple` → `bulkAdd`
 * - `bulkPutTuple` → `bulkPut`
 */
export function TableBulkTupleAddOn(db: Dexie): void {
  const tablePrototype = db.Table.prototype as Table &
    TableInboundBaseBulkTuple<any, any, any> &
    TableInboundAutoBulkTuple<any, any, any> &
    TableOutboundBulkTuple<any, any> &
    TableOutboundAutoBulkTuple<any, any>;
  aliasMethodTs(tablePrototype, "bulkAddTuple", "bulkAdd");
  aliasMethodTs(tablePrototype, "bulkPutTuple", "bulkPut");
}

import Dexie, { type Table } from "dexie";
import type { PrimaryKey } from "./primarykey";
import type { MaybeNoExcess } from "./utilitytypes";

/**
 * Adds `addObject`, a convenience alias of Dexie's `add` that returns
 * the same inserted item, typed to include its derived primary key.
 *
 * Dexie reference: https://dexie.org/docs/Table/Table.add()
 */
export interface TableInboundAutoAdd<
  TDatabase,
  TPKeyPathOrPaths,
  TInsert,
  TExcessDisabled extends boolean,
  TExcessLeaves,
> {
  /**
   * Insert a record and return the inserted object with its primary key populated.
   * The returned type is augmented with the derived key property.
   */
  addObject<T extends TInsert>(
    item: MaybeNoExcess<T, TInsert, TExcessLeaves, TExcessDisabled>,
  ): Promise<
    T & {
      [K in TPKeyPathOrPaths & string]: PrimaryKey<TDatabase, TPKeyPathOrPaths>;
    }
  >;
}
/**
 * Register the `addObject` alias on Dexie Table prototype.
 *
 * Implementation calls `Table.add` and returns the original item so the
 * caller receives the object with its auto/derived primary key populated.
 */
export function AddAutoReturnObjectAddon(db: Dexie): void {
  const tablePrototype = db.Table.prototype as Table & TableInboundAutoAdd<any, any, any, any, any>;

  tablePrototype.addObject = async function (this: Table, item: any): Promise<any> {
    await db.Table.prototype.add.call(this, item);
    return item;
  };
}

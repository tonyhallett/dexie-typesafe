import { type PromiseExtended } from "dexie";
import type { ChangeCallback } from "./Collection";
import type { DexieIndexPaths } from "./indexpaths";
import type { PrimaryKey } from "./primarykey";
import type { TableInboundBase } from "./TableInboundBase";
import type { UpdateSpec } from "./UpdateSpec";

export type TableInbound<
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
> & {
  // note that docs do not mention this ( as the key must exist on the object - so ok for this table type )
  /**
   * Update fields on a single record where the object's primary key is provided by the `object` itself.
   * Dexie reference: https://dexie.org/docs/Table/Table.update/
   */
  update(object: TDatabase, changes: UpdateSpec<TDatabase, TMaxDepth>): PromiseExtended<0 | 1>;
  /**
   * Update via change-callback on a single record; the `object` carries its primary key.
   * Dexie reference: https://dexie.org/docs/Table/Table.update/
   */
  update(
    object: TDatabase,
    changes: ChangeCallback<TDatabase, TInsert, PrimaryKey<TDatabase, TPKeyPathOrPaths>>,
  ): PromiseExtended<0 | 1>;
};

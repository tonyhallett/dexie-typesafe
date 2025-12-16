import { Dexie, type DexieOptions } from "dexie";
import { AddAutoReturnObjectAddon } from "./AddAutoReturnObjectAddOn";
import { TableBulkTupleAddOn } from "./TableBulkTupleAddOn";
import type { TypedDexie } from "./TypedDexie";
import { WhereEqualityAddOn } from "./WhereEqualityAddOn";
import { configureStores } from "./configureStores";
import { mapToClass } from "./mapToClass";
import type { TableConfigAny } from "./tableBuilder";

Dexie.addons.push(TableBulkTupleAddOn);
Dexie.addons.push(AddAutoReturnObjectAddon);
Dexie.addons.push(WhereEqualityAddOn);

/**
 * Create a typed Dexie database configured from declarative table definitions.
 *
 * Configures object stores and indexes from `tableConfigs`, registers internal
 * addons, and maps tables to classes when configs specify `mapToClass`.
 *
 * Overload: No explicit version/options (defaults to version `1`).
 * Record of table names to the return value of a table builder build().
 * @param tableConfigs Declarative table configurations.
 * @param databaseName Name of the IndexedDB database.
 * @returns A typed dexie instance
 */
export function dexieFactory<S extends Record<string, TableConfigAny>>(
  tableConfigs: S,
  databaseName: string
): TypedDexie<S, true>;

/**
 * Overload: Provide a schema `version` number.
 * Record of table names to the return value of a table builder build().
 * @param tableConfigs Declarative table configurations.
 * @param databaseName Name of the IndexedDB database.
 * @param version Schema version to use when configuring stores.
 * @returns A typed dexie instance
 */
export function dexieFactory<S extends Record<string, TableConfigAny>>(
  tableConfigs: S,
  databaseName: string,
  version: number
): TypedDexie<S, true>;

/**
 * Overload: Provide Dexie `options` (no explicit version).
 * Record of table names to the return value of a table builder build().
 * @param tableConfigs Declarative table configurations.
 * @param databaseName Name of the IndexedDB database.
 * @param options Dexie options such as `injectNow` or `addons`.
 * @returns A typed dexie instance
 */
export function dexieFactory<S extends Record<string, TableConfigAny>>(
  tableConfigs: S,
  databaseName: string,
  options: DexieOptions
): TypedDexie<S, true>;

/**
 * Overload: Provide both schema `version` and Dexie `options`.
 * Record of table names to the return value of a table builder build().
 * @param tableConfigs Declarative table configurations.
 * @param databaseName Name of the IndexedDB database.
 * @param version Schema version to use when configuring stores.
 * @param options Dexie options.
 * @returns A typed dexie instance
 */
export function dexieFactory<S extends Record<string, TableConfigAny>>(
  tableConfigs: S,
  databaseName: string,
  version: number,
  options: DexieOptions
): TypedDexie<S, true>;

export function dexieFactory<S extends Record<string, TableConfigAny>>(
  tableConfigs: S,
  databaseName: string,
  versionOrOptions?: number | DexieOptions,
  maybeOptions?: DexieOptions
) {
  const version = typeof versionOrOptions === "number" ? versionOrOptions : 1;
  const options =
    typeof versionOrOptions === "object" ? versionOrOptions : maybeOptions;
  const db = new Dexie(databaseName, options) as unknown as TypedDexie<S, true>;
  configureStores(db, version, tableConfigs);
  mapToClass(db, tableConfigs);
  return db;
}

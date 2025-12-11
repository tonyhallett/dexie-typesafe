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

export function dexieFactory<S extends Record<string, TableConfigAny>>(
  tableConfigs: S,
  databaseName: string
): TypedDexie<S, true>;

export function dexieFactory<S extends Record<string, TableConfigAny>>(
  tableConfigs: S,
  databaseName: string,
  version: number
): TypedDexie<S, true>;

export function dexieFactory<S extends Record<string, TableConfigAny>>(
  tableConfigs: S,
  databaseName: string,
  options: DexieOptions
): TypedDexie<S, true>;

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

import { buildStores } from "./buildStores";
import type { TableConfigAny } from "./tableBuilder";
import type { TypedDexie } from "./TypedDexie";

export function configureStores(
  db: TypedDexie<any, any>,
  version: number,
  tableConfigs: Record<string, TableConfigAny | null>,
  upgradeFunction?: any
): void {
  const dexieVersion = db.version(version).stores(buildStores(tableConfigs));
  if (upgradeFunction) {
    dexieVersion.upgrade(upgradeFunction as any);
  }
}

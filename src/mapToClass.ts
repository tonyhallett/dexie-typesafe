import type { TableConfigAny } from "./tableBuilder";
import type { TypedDexie } from "./TypedDexie";

export function mapToClass(
  db: TypedDexie<any>,
  tableConfigs: Record<string, TableConfigAny | null>
): void {
  for (const [name, cfg] of Object.entries(tableConfigs)) {
    if (cfg && cfg.mapToClass) {
      db.table(name).mapToClass(cfg.mapToClass);
    }
  }
}

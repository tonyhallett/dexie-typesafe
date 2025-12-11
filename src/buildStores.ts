import type { TableConfigAny } from "./tableBuilder";

export function buildStores(
  tableConfigs: Record<string, TableConfigAny | null>
): Record<string, string | null> {
  const stores: Record<string, string | null> = {};
  for (const [name, cfg] of Object.entries(tableConfigs)) {
    if (cfg === null) {
      stores[name] = null;
      continue;
    }
    let indices = cfg.indicesSchema;
    const pk = cfg.pk;
    let pkKey = pk.key === null ? "" : pk.key;
    if (pk.auto) {
      pkKey = "++" + pkKey;
    }
    if (indices !== "") {
      pkKey = `${pkKey},`;
    }
    const schema = pkKey + indices;
    stores[name] = schema;
  }
  return stores;
}

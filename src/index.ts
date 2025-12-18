export { dexieFactory } from "./dexieFactory";
export {
  add,
  PropModification,
  remove,
  RemoveUndefinedBehaviour,
  replacePrefix,
  safeRemoveNumber,
} from "./propmodifications";
export { tableBuilder, tableClassBuilder, tableClassBuilderExcluded } from "./tableBuilder";
export type { Options } from "./tableBuilder";
export type { TableInboundAutoInsert } from "./TableInboundAuto";
export { upgrade, type TableInboundUpgradeConverter } from "./upgrade";

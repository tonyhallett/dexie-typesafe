import {
  PropModification,
  replacePrefix as dexiereplacePrefix,
  add as dexieadd,
  remove as dexieremove,
} from "dexie";

export type AddRemoveNumberType = number | bigint;
export type AddRemoveValueType = AddRemoveNumberType | Array<string | number>;
export type PropModificationValueType = string | AddRemoveValueType;

export abstract class PropModificationTyped<T> {
  constructor() {
    Object.setPrototypeOf(this, PropModification.prototype);
  }
  abstract execute(value: T): T;
}

export function replacePrefix(
  prefix: string,
  replaced: string
): PropModificationTyped<string> {
  return dexiereplacePrefix(prefix, replaced);
}

export function add<T extends AddRemoveValueType>(
  value: T
): PropModificationTyped<T> {
  return dexieadd(value);
}

export function remove<T extends AddRemoveValueType>(
  value: T
): PropModificationTyped<T> {
  return dexieremove(value);
}

export class ObjectPropModification<T> extends PropModificationTyped<T> {
  executor: (value: T) => T;
  constructor(executor: (value: T) => T) {
    super();
    this.executor = executor;
  }
  override execute(value: T): T {
    return this.executor(value);
  }
}

export enum RemoveUndefinedBehaviour {
  LeaveUndefined,
  Zero,
  Negative,
}

export function safeRemoveNumber(
  num: number,
  undefinedBehaviour: RemoveUndefinedBehaviour = RemoveUndefinedBehaviour.LeaveUndefined
): ObjectPropModification<number | undefined> {
  return new ObjectPropModification<number | undefined>((value) => {
    if (value === undefined) {
      switch (undefinedBehaviour) {
        case RemoveUndefinedBehaviour.LeaveUndefined:
          return undefined;
        case RemoveUndefinedBehaviour.Zero:
          return 0;
        case RemoveUndefinedBehaviour.Negative:
          return -num;
      }
    }
    return value - num;
  });
}

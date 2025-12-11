import {
  PropModification as DexiePropModification,
  replacePrefix as dexiereplacePrefix,
  add as dexieadd,
  remove as dexieremove,
} from "dexie";

export type AddRemoveNumberType = number | bigint;
export type AddRemoveValueType = AddRemoveNumberType | Array<string | number>;

export abstract class PropModificationBase<T> {
  private readonly __brand!: T;
  abstract execute(value: T): T;
}

Object.setPrototypeOf(
  PropModificationBase.prototype,
  DexiePropModification.prototype
);

export function replacePrefix(
  prefix: string,
  replaced: string
): PropModificationBase<string> {
  return dexiereplacePrefix(
    prefix,
    replaced
  ) as unknown as PropModificationBase<string>;
}

export function add<T extends AddRemoveValueType>(
  value: T
): PropModificationBase<T> {
  return dexieadd(value) as unknown as PropModificationBase<T>;
}

export function remove<T extends AddRemoveValueType>(
  value: T
): PropModificationBase<T> {
  return dexieremove(value) as unknown as PropModificationBase<T>;
}

export class PropModification<T> extends PropModificationBase<T> {
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
): PropModification<number | undefined> {
  return new PropModification<number | undefined>((value) => {
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

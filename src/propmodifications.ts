import {
  add as dexieadd,
  PropModification as DexiePropModification,
  remove as dexieremove,
  replacePrefix as dexiereplacePrefix,
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

/**
 * Create a string modification that replaces a leading prefix.
 *
 * Useful in `modify()` updates to transform a string property by
 * replacing the given prefix with another value.
 *
 * @param prefix The prefix to look for at the start of the string.
 * @param replaced The replacement value to use when the prefix matches.
 * @returns A `PropModificationBase<string>` to use within `modify()`.
 */
export function replacePrefix(
  prefix: string,
  replaced: string
): PropModificationBase<string> {
  return dexiereplacePrefix(
    prefix,
    replaced
  ) as unknown as PropModificationBase<string>;
}

/**
 * Create a modification that adds to a number or appends to an array.
 *
 * - When used on a `number`/`bigint` property, adds the numeric delta.
 * - When used on an array property, appends the given items.
 *
 * @template T `number | bigint | (string | number)[]`
 * @param value The value to add (numeric delta or array items).
 * @returns A typed `PropModificationBase<T>` for use in `modify()`.
 */
export function add<T extends AddRemoveValueType>(
  value: T
): PropModificationBase<T> {
  return dexieadd(value) as unknown as PropModificationBase<T>;
}

/**
 * Create a modification that subtracts from a number or removes array items.
 *
 * - When used on a `number`/`bigint` property, subtracts the numeric delta.
 * - When used on an array property, removes matching items.
 *
 * @template T `number | bigint | (string | number)[]`
 * @param value The value to remove (numeric delta or array items).
 * @returns A typed `PropModificationBase<T>` for use in `modify()`.
 */
export function remove<T extends AddRemoveValueType>(
  value: T
): PropModificationBase<T> {
  return dexieremove(value) as unknown as PropModificationBase<T>;
}

/**
 * Create a custom property modification using a user-supplied function.
 *
 * This allows expressing updates that aren't covered by the built-in
 * helpers (`add`, `remove`, `replacePrefix`). The `executor` receives the
 * current property value and returns the updated value.
 *
 * @template T The property type being modified.
 */
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

/**
 * Controls how `safeRemoveNumber()` handles `undefined` values.
 */
export enum RemoveUndefinedBehaviour {
  LeaveUndefined,
  Zero,
  Negative,
}

/**
 * Create a numeric subtraction modification that safely handles `undefined`.
 *
 * Applies `value - num` when `value` is a number. When `value` is
 * `undefined`, behavior is controlled by `undefinedBehaviour`:
 * - `LeaveUndefined`: keep `undefined` as-is
 * - `Zero`: treat missing as `0`
 * - `Negative`: result becomes `-num`
 *
 * @param num The amount to subtract from the numeric value.
 * @param undefinedBehaviour Strategy for handling `undefined` values.
 * @returns A `PropModification<number | undefined>` for use in `modify()`.
 */
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

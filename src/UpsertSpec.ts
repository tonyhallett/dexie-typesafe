import type { DeletePrimaryKeys } from "./primarykey";
import type { PropModificationBase } from "./propmodifications";

export type DeepPropertyOrModification<T> = T extends object
  ? T extends (...args: any[]) => any
    ? T
    : T extends Array<any>
    ? T | PropModificationBase<T>
    : {
        [K in keyof T]:
          | DeepPropertyOrModification<T[K]>
          | PropModificationBase<T[K]>;
      }
  : T | PropModificationBase<T>;

export type UpsertSpec<T, TPKeyPathOrPaths> = DeletePrimaryKeys<
  {
    [K in keyof T]:
      | DeepPropertyOrModification<T[K]>
      | PropModificationBase<T[K]>;
  },
  TPKeyPathOrPaths
>;

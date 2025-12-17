export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
export type StringKey<T> = keyof T & string;

export type HasNeverProperty<T> = {
  [K in keyof T]: [T[K]] extends [never]
    ? K
    : T[K] extends object
    ? T[K] extends (...args: any[]) => any
      ? never
      : HasNeverProperty<T[K]> extends never
      ? never
      : K
    : never;
}[keyof T];

type IsFunction<T> = T extends (...args: any[]) => any ? true : false;

// Note that this does not work with parameterless methods
type IsMethod<T, Property extends keyof T> = T[Property] extends (
  arg0: infer A,
  ...args: infer Rest
) => infer R
  ? {
      [key in keyof T]: key extends Property
        ? (arg0: never, ...args: Rest) => R
        : T[key];
    } extends T
    ? true
    : false
  : false;

type ZeroParameters<F extends (...args: any) => any> = Parameters<F> extends []
  ? true
  : false;

type NoExcessDataPropertiesIsPotentialMethod<
  T,
  Property extends keyof T
> = T[Property] extends (...args: any[]) => any
  ? ZeroParameters<T[Property]> extends true
    ? true
    : IsMethod<T, Property>
  : false;

type IndexedDBSafeLeaf =
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined
  | Date
  | RegExp
  | Blob
  | File
  | FileList
  | ArrayBuffer
  | DataView;

type NoExcessDataPropertiesImpl<TExtends, TExtended> =
  // Stop recursion on known safe leaves
  TExtends extends IndexedDBSafeLeaf
    ? TExtends
    : // Arrays / tuples
    TExtends extends readonly any[]
    ? TExtended extends readonly (infer UE)[]
      ? TExtends extends readonly (infer TE)[]
        ? UE extends object
          ? TE extends object
            ? NoExcessDataProperties<TE, UE>[]
            : TExtends
          : TExtends
        : never
      : never
    : // Map
    TExtends extends Map<infer K, infer V>
    ? TExtended extends Map<infer UK, infer UV>
      ? Map<NoExcessDataProperties<K, UK>, NoExcessDataProperties<V, UV>>
      : TExtends
    : // Set
    TExtends extends Set<infer TItem>
    ? TExtended extends Set<infer UItem>
      ? Set<NoExcessDataProperties<TItem, UItem>>
      : TExtends
    : // Objects
    TExtends extends object
    ? TExtended extends object
      ? {
          [K in keyof TExtends]: K extends keyof TExtended
            ? IsFunction<TExtends[K]> extends true
              ? NoExcessDataPropertiesIsPotentialMethod<
                  TExtends,
                  K
                > extends true
                ? TExtends[K]
                : never
              : TExtended[K] extends readonly any[]
              ? TExtends[K] extends readonly (infer TE)[]
                ? TExtended[K] extends readonly (infer UE)[]
                  ? UE extends object
                    ? TE extends object
                      ? NoExcessDataProperties<TE, UE>[]
                      : TExtends[K]
                    : TExtends[K]
                  : never
                : never
              : TExtends[K] extends object
              ? NoExcessDataProperties<TExtends[K], TExtended[K]>
              : TExtends[K]
            : IsFunction<TExtends[K]> extends true
            ? NoExcessDataPropertiesIsPotentialMethod<TExtends, K> extends true
              ? TExtends[K]
              : never
            : never;
        }
      : TExtends
    : TExtends;

export type NoExcessDataProperties<TExtends, TExtended> =
  TExtended extends unknown
    ? NoExcessDataPropertiesImpl<TExtends, TExtended>
    : never;

export type NoExcessDataPropertiesArray<
  TArr extends readonly any[],
  TInsert
> = TArr extends readonly [infer First, ...infer Rest]
  ? First extends TInsert
    ? HasNeverProperty<NoExcessDataProperties<First, TInsert>> extends never
      ? Rest extends readonly []
        ? readonly [First]
        : readonly [First, ...NoExcessDataPropertiesArray<Rest, TInsert>]
      : never
    : never
  : readonly [];

export type StringKeyOf<T> = Extract<keyof T, string>;

export type IncludesNumberInUnion<T> = Extract<T, number> extends never
  ? false
  : true;

export type IncludesNumber<T> = [T] extends [number]
  ? true // exact number
  : Extract<T, number> extends never
  ? false
  : true; // number in union

export type ConstructorOf<T> = new (...args: any[]) => T;

export type NoDuplicates<T extends readonly any[]> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? First extends Rest[number]
    ? never
    : Rest extends readonly any[]
    ? readonly [First, ...NoDuplicates<Rest>]
    : T
  : T;

export type TuplesEqual<A, B> = A extends readonly [...infer AItems]
  ? B extends readonly [...infer BItems]
    ? AItems["length"] extends BItems["length"]
      ? A extends B
        ? B extends A
          ? true
          : false
        : false
      : false
    : false
  : false;

export type NoDescend = "";

export type NextDepth<D extends string> = `${D}I`;

export type First<T extends readonly any[]> = T extends readonly [
  infer A,
  ...any[]
]
  ? A
  : never;

export type PathKeyType<TPath extends string | readonly string[], TKey> = {
  readonly path: TPath;
  readonly keyType: TKey;
};
export type PathKeyTypes = readonly PathKeyType<
  string | readonly string[],
  any
>[];

// helper: get one "last" member of the union
type LastOf<U> = UnionToIntersection<
  U extends any ? () => U : never
> extends () => infer R
  ? R
  : never;

// recursive builder: pick LastOf<U> and prepend to result until U is exhausted
type UnionToTupleRec<U, R extends readonly any[] = readonly []> = [U] extends [
  never
]
  ? R
  : UnionToTupleRec<Exclude<U, LastOf<U>>, readonly [LastOf<U>, ...R]>;

// public type
type UnionToTuple<U> = UnionToTupleRec<U>;
type ExcludeKeys<T, K extends keyof T> = Exclude<keyof T, K>;
export type ExcludeKeysTuple<T, K extends keyof T> = UnionToTuple<
  ExcludeKeys<T, K>
>;

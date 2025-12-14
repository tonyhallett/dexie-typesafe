# dexie-typesafe

A Very Minimalistic Type Safe Wrapper for IndexedDB

# type safe dexie schema

The "tableBuilder" functions ensure that the schema does represent what you see in the database.

That there is no need to know dexie's [schema syntax](<https://dexie.org/docs/Version/Version.stores()>)

1. Provide the type that expect to get from the database, for inbound tables this will include the primary key regardless of being auto increment or not.

2. Determine the type of table by choosing the appropriate "pkey" method.

For outbound tables use `hiddenExplicitPkey` or `hiddenAutoPkey`.

For inbound use `pkey`, `compoundPkey` or `autoPkey` and receive type safety for the path that you choose as well as filtering out invalid paths.

## Demo primary key path choices

![pkey selection](/readme-assets/PkeyDemo.gif)

![compound pkey selection](/readme-assets/CompoundPkeyDemo.gif)

After choosing your table type, choose all the indexes that you require with the same path type safety and `build()`.

## Demo index path choices

![compound pkey selection](/readme-assets/IndexDemo.gif)

Now that the paths have been chosen, dexie methods that have parameters that depend on a primary key or index type will be typed correctly. **link todo**

If you need to choose nested paths then you will need to pass a max depth parameter of the form I,II,III, etc or anything other than "" for all depths.

## Demo max depth type parameter

# Table type specific table properties

Use the return value from `build` with the `dexieFactory` to get

Tables **typed specifically** to what you choose, inbound / outbound, auto / not auto.

These tables will be available on db and transactions as properties, the property names are taken from the keys of the object you supply as first argument.

Table type specific methods enabled properly defined `add`/`bulkAdd`/`put`/`bulkPut` as well as typing the "insert" method parameters differently to the "get" method return values for when the table type is inbound auto.

## Demo dexieFactory, table properties

# Table type specific methods

# Primary key / index value typing

## Virtual index typing.

# upgrade

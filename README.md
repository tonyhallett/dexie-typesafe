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

![tableBuilder max depth type parameter](/readme-assets/TableBuilderMaxDepthDemo.gif)

# Table type specific table properties

Use the return value from `build` with the `dexieFactory` to get

Tables **typed specifically** to what you choose, inbound / outbound, auto / not auto.

These tables will be available on db and transactions as properties, the property names are taken from the keys of the object you supply as first argument.

## Demo dexieFactory, table properties

![Dexie factory](/readme-assets/DexieFactoryDemo.gif)

# Table type specific methods

Table type specific methods enable :

1. Properly defined `add`/`bulkAdd`/`put`/`bulkPut` with respect to the key/keys argument and necessary overloads.

# Dexie docs

[add ](<https://dexie.org/docs/Table/Table.add()>)
[bulkAdd](<https://dexie.org/docs/Table/Table.bulkAdd()>)
[put](<https://dexie.org/docs/Table/Table.put()>)
[bulkPut](<https://dexie.org/docs/Table/Table.bulkPut()>)

Note that there are bulkAddTuple, bulkPutTuple alias methods for stricter typing when you have the parameter as a tuple rather than an array.

For table inbound auto there is an alias addObject that will return the added object with the primary key from the database applied ( as this is what dexie does for you. )

2. With Table inbound the update method is overloaded to allowing providing the primary key using your table item type.

3. Typing the "insert" method parameters differently to the "get" method return values for when the table type is inbound auto.

# Primary key / index value typing

By choosing your primary key / indexes it is possible to use the property types in different methods.

In Collection method callbacks

each

eachKey

eachUniqueKey

eachPrimaryKey

keys

uniqueKeys

primaryKeys

**parameter types**

Table get, bulkGet,

# Table.get example

![Table.get demo](/readme-assets/TableGetDemo.gif)

Table where / Collection.or

# Table.where examples

![Table.where demo](/readme-assets/TableWhereDemo.gif)

# get/where equality

To improve the typescript there are alias methods that you should probably use.

getEquality - prefer being explicit and use one of

getCompositeEquality - using a composite index in full or virtually
getSingleEquality - using a single index
getSingleFilterEquality - using an index and performing a filter ( given that you have not set up a composite index)

Similarly there is

whereEquality

whereCompositeEquality
whereSingleEquality
whereSingleFilterEquality

# equality demo

![Table.where demo](/readme-assets/EqualityDemo.gif)

# prop modification

# upgrade

import { tableBuilder, dexieFactory } from "dexie-typesafe";

interface TableItem1 {
  pkey: string;
  propStr: string;
}

interface TableItem2 {
  compoundPkey1: number;
  compoundPkey2: string;
  propNum: number;
}

const db = dexieFactory(
  {
    table1: tableBuilder<TableItem1>().pkey("pkey").build(),
    table2: tableBuilder<TableItem2>().compoundPkey("compoundPkey1", "compoundPkey2").build(),
  },
  "Demo db",
  1,
);

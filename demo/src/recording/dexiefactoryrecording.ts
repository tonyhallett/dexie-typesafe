import { tableBuilder, dexieFactory } from "dexie-typesafe";

interface TableItem1 {
  pkey: string;
  index: string;
}

interface TableItem2 {
  pkeyAuto: number;
  prop: number;
}

const db = dexieFactory(
  {
    table1: tableBuilder<TableItem1>().pkey("pkey").index("index").build(),
    table2: tableBuilder<TableItem2>().autoPkey("pkeyAuto").build(),
  },
  "Demo db",
  1,
);

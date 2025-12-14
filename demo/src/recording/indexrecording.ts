import { tableBuilder } from "dexie-typesafe";

interface TableItem {
  pkey: string;
  compound1: number;
  compound2: number;
  index1: Date;
  index2: number | undefined;
  boolean: boolean;
  array: Array<string>;
}

tableBuilder<TableItem>().pkey("pkey");

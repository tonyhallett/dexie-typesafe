import { tableBuilder } from "dexie-typesafe";

interface TableItem {
  string: string;
  number: number;
  date: Date;
  boolean: boolean;
  numberOpt?: number;
}

tableBuilder<TableItem>().primaryKey("date");

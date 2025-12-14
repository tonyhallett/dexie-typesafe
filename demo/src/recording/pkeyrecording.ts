import { tableBuilder } from "dexie-typesafe";

interface TableItem {
  string: string;
  number: number;
  date: Date;
  boolean: boolean;
  numberOpt?: number;
}

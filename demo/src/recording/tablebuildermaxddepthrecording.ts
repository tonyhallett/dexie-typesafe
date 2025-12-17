import { tableBuilder } from "dexie-typesafe";

interface TableItem {
  root: string;
  nested: {
    level1: string;
    level1Nested: {
      level2: number;
    };
  };
}

tableBuilder<TableItem, { MaxDepth: "II" }>();

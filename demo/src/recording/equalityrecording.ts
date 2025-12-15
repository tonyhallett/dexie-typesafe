import { tableBuilder, dexieFactory } from "dexie-typesafe";

interface TableItem {
  pkey: string;
  nested: {
    index: string;
  };
  notAnIndex: number;
  compoundIndex1: number;
  compoundIndex2: string;
  compoundIndex3: Date;
}

const db = dexieFactory(
  {
    demo: tableBuilder<TableItem, "", "I">()
      .pkey("pkey")
      .index("nested.index")
      .compoundIndex("compoundIndex1", "compoundIndex2", "compoundIndex3")
      .build(),
  },
  "Demo db"
);

import { dexieFactory, tableBuilder, PropModification } from "dexie-typesafe";

interface TableItem {
  pkey: string;
  nested: {
    index: string;
  };
}

const db = dexieFactory(
  {
    demo: tableBuilder<TableItem, { MaxDepth: "" }>().pkey("pkey").build(),
  },
  "Demo db",
);

db.demo.update("someid", {
  nested: new PropModification((nested) => ({
    index: `updated${nested.index}`,
  })),
});

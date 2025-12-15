import { tableBuilder, dexieFactory } from "dexie-typesafe";

interface TableInboundItem {
  pkey: string;
  nested: {
    index: string;
  };

  compoundIndex1: number;
  compoundIndex2: string;
  compoundIndex3: Date;
}

interface TableOutboundItem {
  index: number;
}

const db = dexieFactory(
  {
    inbound: tableBuilder<TableInboundItem, "", "I">()
      .pkey("pkey")
      .index("nested.index")
      .compoundIndex("compoundIndex1", "compoundIndex2", "compoundIndex3")
      .build(),
    outboundExplicit: tableBuilder<TableOutboundItem>()
      .hiddenExplicitPkey<string>()
      .index("index")
      .build(),
  },
  "Demo db",
  1
);

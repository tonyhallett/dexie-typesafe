import { dexieFactory, tableBuilder, type TableInboundAutoInsert } from "dexie-typesafe";

interface TableDelete {
  thing: string;
}

interface Friend {
  id: number;
  name: string;
}

const dbV1 = dexieFactory(
  {
    toDelete: tableBuilder<TableDelete>().hiddenAutoPkey().build(),
    friends: tableBuilder<Friend>().autoPkey("id").index("name").build(),
  },
  "UpgradeDemo",
);

dbV1.on("populate", (tx) => {
  const friendsSeed: TableInboundAutoInsert<typeof dbV1.friends>[] = [{ name: "Dexter Morgan" }];
  tx.friends.bulkAdd(friendsSeed);
  tx.toDelete.add({ thing: "thing1" });
});

export const db = dbV1;

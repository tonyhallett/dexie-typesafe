import { tableBuilder, dexieFactory, upgrade } from "dexie-typesafe";

interface TableDelete {
  thing: string;
}

interface Friends {
  id: number;
  name: string;
}

const dbV1 = dexieFactory(
  {
    toDelete: tableBuilder<TableDelete>().hiddenAutoPkey().build(),
    friends: tableBuilder<Friends>().autoPkey("id").index("name").build(),
  },
  "UpgradeDemo"
);

dbV1.on("populate", (tx) => {
  tx.friends.add({ name: "Dexter Morgan" });
  tx.toDelete.add({ thing: "thing1" });
});

export const db = dbV1;

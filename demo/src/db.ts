import { dexieFactory, tableBuilder, upgrade } from "dexie-typesafe";

interface FriendV1 {
  id: number;
  name: string;
  dateOfBirth: Date | undefined;
  tags: string[] | undefined;
}

export interface Friend {
  id: number;
  firstName: string;
  lastName: string;
  tags: string[] | undefined;
  dateOfBirth: Date | undefined;
}

const dbV1 = dexieFactory(
  {
    friends: tableBuilder<FriendV1>()
      .autoPkey("id")
      .index("name")
      .index("dateOfBirth")
      .multiIndex("tags")
      .build(),
  },
  "Demo"
);

dbV1.on("populate", (tx) => {
  tx.friends.add({
    name: "Dexter Morgan",
    dateOfBirth: new Date(),
    tags: ["antihero"],
  });
});

const dbV2 = upgrade(
  dbV1,
  {
    friends: tableBuilder<Friend>()
      .autoPkey("id")
      .index("firstName")
      .index("lastName")
      .index("dateOfBirth")
      .multiIndex("tags")
      .build(),
  },
  (tx) => {
    return tx.friends.toCollection().modify((friendV1, ctx) => {
      const nameParts = friendV1.name.split(" ");
      ctx.value = {
        firstName: nameParts[0]!,
        lastName: nameParts[1]!,
        dateOfBirth: friendV1.dateOfBirth,
        tags: friendV1.tags,
      };
    });
  }
);

export const friends = dbV2.friends;

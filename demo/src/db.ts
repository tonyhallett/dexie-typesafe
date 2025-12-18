import { dexieFactory, tableBuilder, upgrade, type TableInboundAutoTInsert } from "dexie-typesafe";
export type FriendV1 = { id: number; name: string; dateOfBirth: Date | undefined; tags: string[] };
export type Friend = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
  dateOfBirthMonthDay: string | undefined;
  tags: string[];
};
const dbV1 = dexieFactory(
  {
    friends: tableBuilder<FriendV1>()
      .autoPkey("id")
      .index("name")
      .index("dateOfBirth")
      .multiIndex("tags")
      .build(),
  },
  "dexie-typesafe-demo",
  1,
);
type InsertFriendV1 = TableInboundAutoTInsert<typeof dbV1.friends>;

const dbV2 = upgrade(
  dbV1,
  {
    friends: tableBuilder<Friend>()
      .autoPkey("id")
      .index("firstName")
      .index("lastName")
      .index("dateOfBirth")
      .index("dateOfBirthMonthDay")
      .multiIndex("tags")
      .build(),
  },
  (tx) => {
    return tx.friends.toCollection().modify((friendV1: FriendV1, ctx) => {
      ctx.value = upgradeFriend(friendV1);
    });
  },
);

dbV2.on("populate", (tx) => {
  const v1Seeds: InsertFriendV1[] = [
    { name: "Dexter Morgan", tags: ["antihero", "tv", "demo"], dateOfBirth: new Date(1971, 0, 1) },
    {
      name: "Donald Trump",
      tags: ["***", "****", "******", "demo"],
      dateOfBirth: new Date(1946, 5, 14),
    },
    {
      name: "Barack Obama",
      tags: ["politician", "us-president", "demo"],
      dateOfBirth: new Date(1961, 7, 4),
    },
    {
      name: "Joe Biden",
      tags: ["politician", "us-president", "demo"],
      dateOfBirth: new Date(1942, 10, 20),
    },
    { name: "Hillary Clinton", tags: ["politician", "demo"], dateOfBirth: new Date(1947, 9, 26) },
    { name: "Angela Merkel", tags: ["politician", "demo"], dateOfBirth: new Date(1954, 6, 17) },
    { name: "Elon Musk", tags: ["tech", "ceo", "demo"], dateOfBirth: new Date(1971, 5, 28) },
    {
      name: "Bill Gates",
      tags: ["tech", "philanthropy", "demo"],
      dateOfBirth: new Date(1955, 9, 28),
    },
    { name: "Steve Jobs", tags: ["tech", "apple", "demo"], dateOfBirth: new Date(1955, 1, 24) },
    {
      name: "Satya Nadella",
      tags: ["tech", "microsoft", "demo"],
      dateOfBirth: new Date(1967, 7, 19),
    },
    { name: "Sundar Pichai", tags: ["tech", "google", "demo"], dateOfBirth: new Date(1972, 5, 10) },
    { name: "Mark Zuckerberg", tags: ["tech", "meta", "demo"], dateOfBirth: new Date(1984, 4, 14) },
  ];
  const seeds = v1Seeds.map(upgradeFriend);
  return tx.friends.bulkAdd(seeds);
});

const upgradeFriend = (friendV1: InsertFriendV1): TableInboundAutoTInsert<typeof dbV2.friends> => {
  const nameParts = friendV1.name.split(" ");
  const dob = friendV1.dateOfBirth;
  const dobMonthDay = dob
    ? String(dob.getMonth() + 1).padStart(2, "0") + "-" + String(dob.getDate()).padStart(2, "0")
    : undefined;
  return {
    firstName: nameParts[0]!,
    lastName: nameParts[1]!,
    dateOfBirth: dob,
    dateOfBirthMonthDay: dobMonthDay,
    tags: friendV1.tags,
  };
};
export const friends = dbV2.friends;

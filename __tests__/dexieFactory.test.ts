import Dexie from "dexie";
import { configureStores } from "../src/configureStores";
import { dexieFactory } from "../src/index";
import { mapToClass } from "../src/mapToClass";
import { TableConfigAny } from "../src/tableBuilder";

jest.mock("../src/configureStores", () => {
  return {
    configureStores: jest.fn(),
  };
});

jest.mock("../src/mapToClass", () => {
  return {
    mapToClass: jest.fn(),
  };
});

describe("dexieFactory", () => {
  it("should create a Dexie database, configure stores and mapToClass", () => {
    const tableConfigs: Record<string, TableConfigAny> = {
      users: {
        indicesSchema: "",
        pk: {
          key: "id",
          auto: true,
        },
      },
    };
    const db = dexieFactory(tableConfigs, "TestDB");
    expect(db).toBeInstanceOf(Dexie);
    expect(db.name).toBe("TestDB");
    expect(configureStores).toHaveBeenCalledWith(db, 1, tableConfigs);
    expect(mapToClass).toHaveBeenCalledWith(db, tableConfigs);
  });

  xit("should add addons to Dexie", () => {
    // todo
  });
});

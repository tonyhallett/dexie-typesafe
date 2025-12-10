import { PropModification } from "dexie";
import {
  add,
  ObjectPropModification,
  remove,
  replacePrefix,
} from "../src/index";

describe("PropModification exports", () => {
  it("should export add function that wraps dexie's PropModification", () => {
    expect(add(5)).toBeInstanceOf(PropModification);
    expect((add(5) as any as PropModification)["@@propmod"].add).toBe(5);
  });

  it("should export remove function that wraps dexie's PropModification", () => {
    expect(remove(5)).toBeInstanceOf(PropModification);
    expect((remove(5) as any as PropModification)["@@propmod"].remove).toBe(5);
  });

  it("should export replacePrefix function that wraps dexie's PropModification", () => {
    expect(replacePrefix("prefix", "replaced")).toBeInstanceOf(
      PropModification
    );
    expect(
      (replacePrefix("prefix", "replaced") as any as PropModification)[
        "@@propmod"
      ].replacePrefix
    ).toEqual(["prefix", "replaced"]);
  });

  it("should export ObjectPropModification class, instanceof PropModification true", () => {
    new ObjectPropModification<string>((v) => v);
    expect(new ObjectPropModification<string>((v) => v)).toBeInstanceOf(
      PropModification
    );
  });
});

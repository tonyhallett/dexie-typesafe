import { PropModification as DexiePropModification } from "dexie";
import { add, PropModification, remove, replacePrefix } from "../src/index";

describe("PropModification exports", () => {
  it("should export add function that wraps dexie's PropModification", () => {
    expect(add(5)).toBeInstanceOf(DexiePropModification);
    expect((add(5) as any as DexiePropModification)["@@propmod"].add).toBe(5);
  });

  it("should export remove function that wraps dexie's PropModification", () => {
    expect(remove(5)).toBeInstanceOf(DexiePropModification);
    expect((remove(5) as any as DexiePropModification)["@@propmod"].remove).toBe(5);
  });

  it("should export replacePrefix function that wraps dexie's PropModification", () => {
    expect(replacePrefix("prefix", "replaced")).toBeInstanceOf(DexiePropModification);
    expect(
      (replacePrefix("prefix", "replaced") as any as DexiePropModification)["@@propmod"]
        .replacePrefix,
    ).toEqual(["prefix", "replaced"]);
  });

  it("should export PropModification class, instanceof dexie's PropModification true", () => {
    const propModification = new PropModification<string>((s) => s + " modified");
    expect(propModification.execute("test")).toBe("test modified");
    expect(propModification).toBeInstanceOf(DexiePropModification);
  });
});

import {
  compoundIndexErrorInstance,
  duplicateKeysErrorInstance,
  tableBuilder,
  TableConfigAny,
} from "../src/tableBuilder";

describe("tableBuilder", () => {
  describe("primary key only", () => {
    it("should build with just primary key", () => {
      const tableConfig = tableBuilder<{ id: number }>().pkey("id").build();
      expect(tableConfig.pk).toEqual({ key: "id", auto: false });
      expectNoSchemaOrMapToClass(tableConfig);
    });

    it("should build with just auto primary key", () => {
      const tableConfig = tableBuilder<{ id: number }>()
        .autoIncrementPkey("id")
        .build();
      expect(tableConfig.pk).toEqual({ key: "id", auto: true });
      expectNoSchemaOrMapToClass(tableConfig);
    });

    it("should build with just compound primary key", () => {
      const tableConfig = tableBuilder<{ id1: number; id2: number }>()
        .compoundPkey("id1", "id2")
        .build();

      expect(tableConfig.pk).toEqual({ key: "[id1+id2]", auto: false });
      expectNoSchemaOrMapToClass(tableConfig);
    });

    it("should build with just hidden auto", () => {
      const tableConfig = tableBuilder<{ id1: number }>()
        .hiddenAutoPkey()
        .build();
      expectHiddenNoIndices(tableConfig, true);
    });

    it("should build with just hidden explicit", () => {
      const tableConfig = tableBuilder<{ id1: number }>()
        .hiddenExplicitPkey()
        .build();
      expectHiddenNoIndices(tableConfig, false);
    });

    it("should error on duplicate compound part", () => {
      const error = tableBuilder<{ id: number; index: string }>().compoundPkey(
        "id",
        "id"
      );

      expect(error).toBe(duplicateKeysErrorInstance);
    });

    function expectHiddenNoIndices(
      tableConfig: TableConfigAny,
      expectedAuto: boolean
    ) {
      expect(tableConfig.pk).toEqual({ key: null, auto: expectedAuto });
      expectNoSchemaOrMapToClass(tableConfig);
    }
    function expectNoSchemaOrMapToClass(tableConfig: TableConfigAny) {
      expect(tableConfig.indicesSchema).toBe("");
      expect(tableConfig.mapToClass).toBeUndefined();
    }
  });

  describe("should build with indexes", () => {
    it("should do single index", () => {
      const tableConfig = tableBuilder<{ id: number; theindex: string }>()
        .pkey("id")
        .index("theindex")
        .build();
      expect(tableConfig.indicesSchema).toBe("theindex");
    });

    it("should do unique single index", () => {
      const tableConfig = tableBuilder<{ id: number; theindex: string }>()
        .pkey("id")
        .uniqueIndex("theindex")
        .build();
      expect(tableConfig.indicesSchema).toBe("&theindex");
    });

    it("should do multi index", () => {
      const tableConfig = tableBuilder<{ id: number; multi: string[] }>()
        .pkey("id")
        .multiIndex("multi")
        .build();
      expect(tableConfig.indicesSchema).toBe("*multi");
    });

    it("should do unique multi index", () => {
      const tableConfig = tableBuilder<{ id: number; multi: string[] }>()
        .pkey("id")
        .uniqueMultiIndex("multi")
        .build();
      expect(tableConfig.indicesSchema).toBe("&*multi");
    });

    it("should do compound index", () => {
      const tableConfig = tableBuilder<{
        id: number;
        compoundIndex1: string;
        compoundIndex2: string;
      }>()
        .pkey("id")
        .compoundIndex("compoundIndex1", "compoundIndex2")
        .build();
      expect(tableConfig.indicesSchema).toBe("[compoundIndex1+compoundIndex2]");
    });

    it("should do unique compound index", () => {
      const tableConfig = tableBuilder<{
        id: number;
        compoundIndex1: string;
        compoundIndex2: string;
      }>()
        .pkey("id")
        .uniqueCompoundIndex("compoundIndex1", "compoundIndex2")
        .build();
      expect(tableConfig.indicesSchema).toBe(
        "&[compoundIndex1+compoundIndex2]"
      );
    });

    it("should join all indexes together", () => {
      const tableConfig = tableBuilder<{
        id: number;
        uniqueIndex: string;
        index2: string;
        compoundIndex1: string;
        compoundIndex2: string;
        multi: string[];
      }>()
        .pkey("id")
        .uniqueIndex("uniqueIndex")
        .index("index2")
        .compoundIndex("compoundIndex1", "compoundIndex2")
        .multiIndex("multi")
        .build();
      expect(tableConfig.indicesSchema).toBe(
        "&uniqueIndex,index2,[compoundIndex1+compoundIndex2],*multi"
      );
    });

    describe("error return cases", () => {
      it("should error on duplicate compound entries", () => {
        const error = tableBuilder<{
          id: number;
          index1: string;
          index2: string;
        }>()
          .pkey("id")
          .compoundIndex("index1", "index1");

        expect(error).toBe(compoundIndexErrorInstance);
      });

      it("should error on duplicate compound", () => {
        const error = tableBuilder<{
          id: number;
          index1: string;
          index2: string;
        }>()
          .pkey("id")
          .compoundIndex("index1", "index2")
          .compoundIndex("index1", "index2");

        expect(error).toBe(compoundIndexErrorInstance);
      });
    });
  });
});

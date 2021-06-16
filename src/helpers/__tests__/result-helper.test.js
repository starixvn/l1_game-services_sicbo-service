import { getSettlementResult, generateResult } from "../result-helper";
import testData from "./test-data.json";

describe("getSettlementResult tests", () => {
  
    it.each(testData)("should return correct settlement", (result, settlementResult) => {
        expect(getSettlementResult(result)).toEqual(settlementResult);
    });
});

describe("generateResult tests", () => {
    it("return correctly", () => {
        const result = generateResult();
        expect(Object.keys(result)).toHaveLength(3);
    });
});

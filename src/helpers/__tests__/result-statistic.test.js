import { generateResult, getSettlementResult } from "./../result-helper";

describe("Result statistic: 100000 times", () => {
    // arrange
    const total = 100_000;
    for (let index = 0; index < 3; index++) {
        it(`should generate results statistically correct with mode ${index + 1}`, () => {
            // arrange
            const statisticResult = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
            };
            const dragonTails = {};
            let isBig = false;
            let continuity = 0;

            // act
            for (let i = 0; i < total; i++) {
                const result = generateResult(index + 1);
                statisticResult[result.dice1] += 1;
                statisticResult[result.dice2] += 1;
                statisticResult[result.dice3] += 1;
                if (i > 0) {
                    const settlementResult = getSettlementResult(result);
                    if (settlementResult.big && isBig) {
                        continuity++;
                    } else {
                        if (settlementResult.small && !isBig) {
                            continuity++;
                        } else {
                            if (continuity >= 4) {
                                dragonTails[continuity] = dragonTails[continuity] ?? 0;
                                dragonTails[continuity] += 1;
                            }
                            continuity = 0;
                        }
                    }
                    isBig = settlementResult.big ? true : false;
                }
            }

            // assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat(((statisticResult[key] / total) * 100) / 3).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${index + 1}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            console.log(`dragon tails: ${JSON.stringify(dragonTails)}`);
            Object.values(resultPercentage).forEach((value) => {
                expect(value).toBeGreaterThanOrEqual(16);
            });
            expect(dragonTails[4]).toBeLessThan(1600);
            expect(dragonTails[5]).toBeLessThan(800);
            expect(dragonTails[6]).toBeLessThan(400);
            expect(dragonTails[7]).toBeLessThan(200);
            expect(dragonTails[8]).toBeLessThan(100);
            expect(dragonTails[9]).toBeLessThan(60);
            expect(dragonTails[10]).toBeLessThan(35);
        });
    }
});

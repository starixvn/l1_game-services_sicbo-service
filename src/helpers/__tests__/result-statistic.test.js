import { generateResult } from "./../result-helper";

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

            // act
            for (let i = 0; i < total; i++) {
                const result = generateResult(index + 1);
                statisticResult[result.dice1] += 1;
                statisticResult[result.dice2] += 1;
                statisticResult[result.dice3] += 1;
            }

            // assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat(((statisticResult[key] / total) * 100) / 3).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${index + 1}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            Object.values(resultPercentage).forEach((value) => {
                expect(value).toBeGreaterThanOrEqual(16);
            });
        });
    }
});

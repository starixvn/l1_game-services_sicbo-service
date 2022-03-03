import { generateResult, groups } from "../result-helper";

describe("Result Statistic: 10000 times", () => {
    for (let modeIndex = 1; modeIndex <= Object.keys(groups).length; modeIndex++) {
        it(`should generate result with correct percentage with mode ${modeIndex}`, () => {
            // Arrange
            let results = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
            };
            const totalRounds = 10000;

            // Act
            for (let index = 0; index < totalRounds; index++) {
                const result = generateResult(modeIndex);
                results[result.dice1]++;
                results[result.dice2]++;
                results[result.dice3]++;
            }

            // Assert
            const resultPercentage = Object.keys(results).reduce((percentage, key) => {
                percentage[key] = parseFloat((results[key] / (totalRounds * 3)) * 100).toFixed(2);

                return percentage;
            }, {});

            console.log(`Mode:${modeIndex}, result: ${JSON.stringify(resultPercentage)}`);
            const allResultPercentGoodEnough = Object.keys(resultPercentage).every((key) => resultPercentage[key] >= 16.2);
            expect(allResultPercentGoodEnough).toBe(true);
        });
    }
});

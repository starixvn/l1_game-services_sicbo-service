import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";
import gameSettings from "./../src/game-settings";

export const ingameTest = () => {
    describe("when user joins game", () => {
        let driver;
        beforeAll(async () => {
            driver = new GameClientDriver(socketOptions, initUserSession(normalUser));
            await driver.handleSignedInEvent();
        });

        afterAll(() => {
            driver.close();
        });

        const getTimeOutToPlacingBetTime = (remainingTime, durations) => {
            let timeout = 0;
            if (remainingTime <= durations.lockingBet) {
                timeout = durations.wholeRound - durations.placingBets + remainingTime + 1;
            } else if (remainingTime > durations.placingBets) {
                timeout = durations.wholeRound - durations.placingBets + 1;
            }

            return timeout;
        };

        const getTimeOutToSettleTime = (remainingTime, durations) => {
            let timeout = 0;
            if (remainingTime <= durations.placingBets) {
                timeout = remainingTime + 2;
            }

            return timeout;
        };

        it("should return game configs", async () => {
            // Arrange
            driver.sendInGameEvent();

            // Act
            const result = await driver.handleGameEvent((inGameData) => inGameData.gameConfigs);
            const { gameConfigs } = result;

            // Assert

            expect(gameConfigs.minBet).toEqual(1);
            expect(gameConfigs.maxBet).toEqual(3000);
            expect(gameConfigs.maxBetPerChoices).toStrictEqual({
                specific1: 2000,
                specific2: 2000,
                specific3: 2000,
                specific4: 2000,
                specific5: 2000,
                specific6: 2000,
                big: 2000,
                small: 2000,
                anyTriple: 100,
                total4: 100,
                total5: 100,
                total6: 100,
                total7: 100,
                total8: 500,
                total9: 500,
                total10: 500,
                total11: 500,
                total12: 500,
                total13: 500,
                total14: 100,
                total15: 100,
                total16: 100,
                total17: 100,
            });

            expect(gameConfigs.odds).toStrictEqual({
                single: 2,
                double: 3.5,
                triple: 6,
                big: 2,
                small: 2,
                anyTriple: 31,
                total4: 61,
                total5: 31,
                total6: 18,
                total7: 13,
                total8: 9,
                total9: 7,
                total10: 7,
                total11: 7,
                total12: 7,
                total13: 9,
                total14: 13,
                total15: 18,
                total16: 31,
                total17: 61,
            });
        });

        it("should return user info", async () => {
            // Arrange
            driver.sendInGameEvent();

            // Act
            const result = await driver.handleGameEvent((inGameData) => inGameData.user);
            const { user } = result;

            // Assert
            expect(user).toStrictEqual({
                UID: 1,
                avatarId: 1,
                currency: "$US",
                name: "NormalUser",
                rate: 1,
                red: 25000,
                type: false,
            });
        });

        it("should return round history", async () => {
            // Arrange
            driver.sendInGameEvent();

            // Act
            const result = await driver.handleGameEvent((inGameData) => inGameData.roundHistory);
            const { roundHistory } = result;

            // Assert
            expect(roundHistory.length).toBeGreaterThan(0);
        });

        describe("when join game in placing bet time", () => {
            it("should return resultHash with hashValue", async () => {
                // Arrange
                driver.sendInGameEvent();

                // Act
                const { remainingTime } = await driver.handleGameEvent((inGameData) => inGameData.remainingTime);

                const timeout = getTimeOutToPlacingBetTime(remainingTime, gameSettings.durations) * 1000;
                setTimeout(() => {
                    driver.sendInGameEvent();
                }, timeout);

                const result = await driver.handleGameEvent((inGameData) => inGameData.resultHash);

                // Assert
                expect(result.resultHash.hashValue).not.toBeEmpty();
            });
        });

        describe("when join game in settle time", () => {
            it("should return resultHash with rawValue", async () => {
                // Arrange
                driver.sendInGameEvent();

                // Act
                const { remainingTime } = await driver.handleGameEvent((inGameData) => inGameData.remainingTime);

                const timeout = getTimeOutToSettleTime(remainingTime, gameSettings.durations) * 1000;
                setTimeout(() => {
                    driver.sendInGameEvent();
                }, timeout);

                const result = await driver.handleGameEvent((inGameData) => inGameData.resultHash);

                // Assert
                expect(result.resultHash.rawValue).not.toBeNull();
            });
        });
    });
};

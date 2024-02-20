import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";

export const getHistoryTest = () => {
    describe("when get history", () => {
        let driver;
        beforeAll(async () => {
            driver = new GameClientDriver(socketOptions, initUserSession(normalUser));
            await driver.handleSignedInEvent();
            driver.sendInGameEvent();
            await driver.handleGameEvent((inGameData) => inGameData.remainingTime);
        });

        afterAll(() => {
            driver.close();
        });

        it("should return history", async () => {
            // Arrange
            const expectedData = [
                {
                    specific1: 0,
                    specific2: 0,
                    specific3: 0,
                    specific4: 0,
                    specific5: 0,
                    specific6: 0,
                    big: 0,
                    small: 10,
                    anyTriple: 0,
                    total4: 0,
                    total5: 0,
                    total6: 0,
                    total7: 0,
                    total8: 0,
                    total9: 0,
                    total10: 0,
                    total11: 0,
                    total12: 0,
                    total13: 0,
                    total14: 0,
                    total15: 0,
                    total16: 0,
                    total17: 0,
                    totalAmount: 10,
                    betwin: 20,

                    freeBet: false,
                    roundId: 1190118,
                    name: "NormalUser",
                    odds: {
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
                    },
                    rate: 1,
                    betLogDetails: [],
                    phien: 1190118,
                },
                {
                    specific1: 0,
                    specific2: 0,
                    specific3: 0,
                    specific4: 0,
                    specific5: 0,
                    specific6: 0,
                    big: 10,
                    small: 0,
                    anyTriple: 0,
                    total4: 0,
                    total5: 0,
                    total6: 0,
                    total7: 0,
                    total8: 0,
                    total9: 0,
                    total10: 0,
                    total11: 0,
                    total12: 0,
                    total13: 0,
                    total14: 0,
                    total15: 0,
                    total16: 0,
                    total17: 0,
                    totalAmount: 10,
                    betwin: 0,
                    freeBet: false,
                    phien: 1190119,
                    roundId: 1190119,
                    name: "NormalUser",
                    odds: {
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
                    },
                    rate: 1,
                    betLogDetails: [],
                },
            ];

            // Act
            driver.sendGetHistoryEvent();
            const result = await driver.handleGameEvent((historyData) => historyData.history);

            // Assert
            const actualBetLogs = result.history.betLogs.map((betLog) => {
                delete betLog.result;
                delete betLog.settlementResult;
                return betLog;
            });

            expect(actualBetLogs).toEqual(expectedData);
            expect(result.history.total).toBeGreaterThan(0);
            expect(result.history.page).toBe(1);
            expect(result.history.pageSize).toBe(8);
        });
    });
};

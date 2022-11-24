jest.mock("sc-rebet-mode", () => {
    return {
        Crons: {
            ProcessBetQueue: class A {
                generatePlacingBetResult() {
                    return { x: 123 };
                }
            },
        },
    };
});
import ProcessBetQueue from "../process-bet-queue";

describe("generatePlacingBetResult", () => {
    it("when rebet should return rebet", () => {
        // Arrange
        const processBetQueue = new ProcessBetQueue();
        const player = {
            session: {
                currencyGroupId: "1",
            },
        };
        const balance = {};
        const bet = {
            rebet: true,
            lastBet: {
                big: 10,
                anyTriple: 20,
            },
        };
        const rebet = { x: 1 };
        processBetQueue.gameData = {
            currencyGroupGames: [
                {
                    groupId: 1,
                    chips: [],
                },
            ],
        };
        processBetQueue.rebetProcessor = {
            convertRebetToChipList: jest.fn(() => rebet),
        };

        // Act
        const result = processBetQueue.generatePlacingBetResult(player, balance, bet);

        // Assert
        expect(result).toEqual({ x: 123, rebet: { x: 1 } });
    });

    it("when normal should return ownchip", () => {
        // Arrange
        const processBetQueue = new ProcessBetQueue();
        const player = {
            session: {
                currencyGroupId: "1",
            },
        };
        const balance = {};
        const bet = {
            betChoice: "big",
            amount: 10,
        };

        // Act
        const result = processBetQueue.generatePlacingBetResult(player, balance, bet);

        // Assert
        expect(result).toEqual({ x: 123, ownChip: { betChoice: "big", amount: 10 } });
    });
});

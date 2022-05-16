import { Table } from "sc-game-base";
import { stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import gameSettings from "../../game-settings";
import { RoundResultPublisher, UserBetResultPublisher } from "sc-game-base/src/core/event-publishers";
import SettleGameRoundConsumer from "../settle-game-round-consumer";

jest.mock("sc-game-base/src/core/event-publishers");
const endGame = jest.fn();
const execMockFunc = jest.fn();
const betsRepository = {
    find: () => ({
        exec: execMockFunc,
    }),
};

/** @type {mongoose.Model}*/
const roundsRepository = stubMongooseModelStupidly(mongoose.Model);

const definition = new Table.TableGameDefinition(gameSettings);
const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);
gameData.gameConfigs = {
    enabled: true,
    botenabled: false,
    minbet: 1,
    maxbet: 2000,
    disabledround: 277674,
    bot_maxbet: 500,
    choices_maxbet: {
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
    },
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
    enableFreeBet: false,
};
const userBetResultPublisher = new UserBetResultPublisher(definition.name, gameData);
const roundResultPublisher = new RoundResultPublisher(definition.name, gameData);
const initConsumer = () => {
    return new SettleGameRoundConsumer({
        definition,
        gameData,
        roundResultPublisher,
        userBetResultPublisher,
        endGame,
        roundsRepository,
        betsRepository,
    });
};

const settlementResult = {
    specific1: true,
    specific2: false,
    specific3: false,
    specific4: false,
    specific5: false,
    specific6: false,
    big: false,
    small: false,
    anyTriple: true,
    total4: false,
    total5: false,
    total6: false,
    total7: false,
    total8: false,
    total9: false,
    total10: false,
    total11: false,
    total12: false,
    total13: false,
    total14: false,
    total15: false,
    total16: false,
    total17: false,
};

const result = {
    dice1: 1,
    dice2: 1,
    dice3: 1,
};

describe("calculateBetResult test", () => {
    const testData = [
        [
            {
                specific1: 1,
                specific2: 0,
                specific3: 0,
                specific4: 0,
                specific5: 0,
                specific6: 0,
                big: 0,
                small: 0,
                anyTriple: 0,
                total4: 1,
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
            },
            {
                totalBetAmount: 2,
                totalWin: 6,
                netWin: 5,
                totalLost: 1,
                winningByChoices: {
                    specific1: 6,
                    specific2: 0,
                    specific3: 0,
                    specific4: 0,
                    specific5: 0,
                    specific6: 0,
                    big: 0,
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
                },
            },
        ],
    ];
    it.each(testData)("should calculate bet result correctly", (bet, expectedBetResult) => {
        const consumer = initConsumer();
        const betResult = consumer.calculateBetResult(settlementResult, bet, gameData.gameConfigs.odds, result);
        expect(betResult).toEqual(expectedBetResult);
    });
});

describe("settle bet tests", () => {
    describe(" when there is no bet", () => {
        it("should call roundpublisher", async () => {
            execMockFunc.mockReturnValueOnce([]);
            const consumer = initConsumer();
            await consumer.settleBets({ result, settlementResult, roundId: 1, time: new Date() });
            expect(roundResultPublisher.publishRoundResult).toHaveBeenCalled();
        });

        it("should not  call userBetResultPublisher", async () => {
            execMockFunc.mockReturnValueOnce([]);
            const consumer = initConsumer();
            await consumer.settleBets({ result, settlementResult, roundId: 1, time: new Date() });
            expect(userBetResultPublisher.publish).not.toHaveBeenCalled();
        });
    });

    describe("when there is  bet", () => {
        beforeEach(() => {
            endGame.mockReturnValueOnce({ isOk: true });
            execMockFunc.mockImplementationOnce(() => [
                {
                    specific1: 1,
                    specific2: 0,
                    specific3: 0,
                    specific4: 0,
                    specific5: 0,
                    specific6: 0,
                    big: 0,
                    small: 0,
                    anyTriple: 0,
                    total4: 1,
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
                    save: function () {},
                },
            ]);
        });

        it("should call endgame", async () => {
            const consumer = initConsumer();

            await consumer.settleBets({ result, settlementResult, roundId: 1, time: new Date() });

            expect(endGame).toHaveBeenCalled();
        });

        it("should call roundpublisher ", async () => {
            const consumer = initConsumer();

            await consumer.settleBets({ result, settlementResult, roundId: 1, time: new Date() });

            expect(roundResultPublisher.publishRoundResult).toHaveBeenCalled();
        });

        it("should call user bet publisher", async () => {
            const consumer = initConsumer();

            await consumer.settleBets({ result, settlementResult, roundId: 1, time: new Date() });

            expect(userBetResultPublisher.publish).toHaveBeenCalled();
        });
    });
});

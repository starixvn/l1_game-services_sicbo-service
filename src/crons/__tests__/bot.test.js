import { stub, stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import gameSettings from "../../game-settings";
import { Table } from "sc-game-base";
import SicBoBot from "../bot";

jest.mock("sc-common/helpers/config-helper", () => ({
    getMaxBotForCurrentHour: () => 1,
}));

const definition = new Table.TableGameDefinition(gameSettings);
const gameData = new Table.TableGameData(gameSettings.durations.placingBets - 1);
gameData.gameConfigs = {
    enabled: true,
    minbet: 1,
    maxbet: 2000,
    bot_maxbet: 1000,
    bot_maxbet: 500,
    botenabled: true,
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
};

const findExecMockFunction = jest.fn();
/** @type {mongoose.Model}*/
const userInfosRepository = {
    find: () => ({
        lean: () => ({
            exec: findExecMockFunction,
        }),
    }),
    countDocuments: () => ({
        exec: () => 5,
    }),
};

const botPlayers = [
    { id: 1, name: "bot1", red: 1000 },
    { id: 2, name: "bot2", red: 1000 },
    { id: 3, name: "bot3", red: 1000 },
    { id: 4, name: "bot4", red: 1000 },
    { id: 5, name: "bot5", red: 1000 },
];

describe("reset tests", () => {
    it("bot list should be empty when botenabled is false", async () => {
        gameData.gameConfigs.botenabled = false;
        const bot = new SicBoBot(definition, gameData, userInfosRepository);

        await bot.reset();

        expect(bot.botList).toBeEmpty();
        gameData.gameConfigs.botenabled = true;
    });

    it("bot list should have data when botenabled is true", async () => {
        findExecMockFunction.mockReturnValueOnce(botPlayers);
        const bot = new SicBoBot(definition, gameData, userInfosRepository);

        await bot.reset();

        expect(bot.botList).not.toBeEmpty();
    });
});

describe("place bet tests", () => {
    beforeEach(() => {
        findExecMockFunction.mockReturnValueOnce(botPlayers);
    });
    describe("when successful bet", () => {
        it("should update totalTickets", async () => {
            // arrange
            const bot = new SicBoBot(definition, gameData, userInfosRepository);
            await bot.reset();

            // act
            bot.placeBet(botPlayers[0]);

            // arrange
            expect(bot.totalTickets).toEqual(1);
        });

        it("should update smallTickets", async () => {
            // arrange
            const bot = new SicBoBot(definition, gameData, userInfosRepository);
            await bot.reset();

            // act
            bot.placeBet(botPlayers[0]);

            // arrange
            expect(bot.smallTickets).toEqual(1);
        });

        it("should update allBets", async () => {
            // arrange
            const bot = new SicBoBot(definition, gameData, userInfosRepository);
            await bot.reset();

            // act
            bot.placeBet(botPlayers[0]);

            // arrange
            expect(Object.values(bot.allBets).some((amount) => amount > 0)).toBeTrue();
        });
    });

    describe("when locking bet time", () => {
        afterEach(() => {
            gameData.remainingTime = gameSettings.durations.placingBets - 1;
        });
        it("shouldnt update totalTickets", async () => {
            // arrange
            const bot = new SicBoBot(definition, gameData, userInfosRepository);
            gameData.remainingTime = gameSettings.durations.lockingBet - 1;
            await bot.reset();

            // act
            bot.placeBet(botPlayers[0]);

            // arrange
            expect(bot.totalTickets).toEqual(0);
        });

        it("shouldnt update smallTickets", async () => {
            // arrange
            const bot = new SicBoBot(definition, gameData, userInfosRepository);
            gameData.remainingTime = gameSettings.durations.lockingBet - 1;
            await bot.reset();

            // act
            bot.placeBet(botPlayers[0]);

            // arrange
            expect(bot.smallTickets).toEqual(0);
        });

        it("shouldnt update allBets", async () => {
            // arrange
            const bot = new SicBoBot(definition, gameData, userInfosRepository);
            gameData.remainingTime = gameSettings.durations.lockingBet - 1;
            await bot.reset();

            // act
            bot.placeBet(botPlayers[0]);

            // arrange
            expect(Object.values(bot.allBets).every((amount) => amount === 0)).toBeTrue();
        });
    });
});

describe("max bet test", () => {
    it("should return correct max bet with anyTriple Choice", async () => {
        findExecMockFunction.mockReturnValueOnce(botPlayers);
        const bot = new SicBoBot(definition, gameData, userInfosRepository);
        await bot.reset();
        const maxBet = bot.getMaxBet(botPlayers[0], "anyTriple");
        expect(maxBet).toEqual(Math.min(gameData.gameConfigs.choices_maxbet.anyTriple, gameData.gameConfigs.bot_maxbet * 0.1));
    });

    it("should return correct max bet with total Choice", async () => {
        findExecMockFunction.mockReturnValueOnce(botPlayers);
        const bot = new SicBoBot(definition, gameData, userInfosRepository);
        await bot.reset();
        const maxBet = bot.getMaxBet(botPlayers[0], "total8");
        expect(maxBet).toEqual(Math.min(gameData.gameConfigs.choices_maxbet.total8, gameData.gameConfigs.bot_maxbet * 0.2));
    });

    it.each(["specific1", "specific2", "specific3", "specific4", "specific5", "specific6", "big", "small"])(
        "should return choice's max bet when small tickets is greater than its raito",
        async (choice) => {
            findExecMockFunction.mockReturnValueOnce(botPlayers);
            const bot = new SicBoBot(definition, gameData, userInfosRepository);
            await bot.reset();
            bot.totalTickets = 1;
            bot.smallTickets = 1;
            const maxBet = bot.getMaxBet(botPlayers[0], choice);
            expect(maxBet).toEqual(Math.min(gameData.gameConfigs.choices_maxbet[choice], gameData.gameConfigs.bot_maxbet));
        }
    );
});

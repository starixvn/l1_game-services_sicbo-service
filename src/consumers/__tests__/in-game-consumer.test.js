import { Table } from "sc-game-base";
import { stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import InGameConsumer from "../in-game-consumer";
import gameSettings from "../../game-settings";
import { RoundQuery } from "sc-game-base/src/core/query-apis";

jest.mock("sc-game-base/src/core/query-apis");
const getBalance = jest.fn();
const roundQuery = new RoundQuery();

/** @type {mongoose.Model}*/
const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);

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
gameData.exchangeRates = {
    exId: 1,
    code: {
        USD: 1,
        VND: 0.00004405,
        IDR: 0.07099,
    },
};

describe("build payload tests", () => {
    it("should return object with chips", async () => {
        userInfosRepository.findOne().lean().exec.mockReturnValueOnce({});
        roundQuery.getList.mockReturnValueOnce([]);

        const realPlayer = {
            profile: {
                name: "player01",
            },
            session: {
                currencyCode: "USD",
                multiplier: 1,
                currencyGroupId: 1,
            },
        };
        gameData.ingame[realPlayer.profile.name] = {
            chips: {
                specific1: {
                    10: 1,
                },
            },
        };
        const consumer = new InGameConsumer(definition, gameData, roundQuery, null, getBalance, userInfosRepository);
        const payload = await consumer.buildPayload(realPlayer);

        expect(payload.chips).toEqual({
            specific1: {
                10: 1,
            },
        });
    });

    it("should return chips empty object when gameData has no data", async () => {
        userInfosRepository.findOne().lean().exec.mockReturnValueOnce({});
        roundQuery.getList.mockReturnValueOnce([]);

        const realPlayer = {
            profile: {
                name: "player01",
            },
            session: {
                currencyCode: "USD",
                multiplier: 1,
                currencyGroupId: 1,
            },
        };

        const consumer = new InGameConsumer(definition, gameData, roundQuery, null, getBalance, userInfosRepository);
        const payload = await consumer.buildPayload(realPlayer);

        expect(payload.chips).toBeEmpty();
    });

    afterEach(() => {
        gameData.ingame = {};
    });
});

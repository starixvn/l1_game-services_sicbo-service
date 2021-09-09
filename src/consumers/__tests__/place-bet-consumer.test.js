import PlaceBetConsumer from "../place-bet-consumer";
import { Table } from "sc-game-base";
import gameSettings from "../../game-settings";
import { generateResult, getSettlementResult } from "../../helpers/result-helper";
import { helpers } from "sc-common";

const gameConfigs = {
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

const definition = new Table.TableGameDefinition(gameSettings, generateResult, getSettlementResult);
const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);
gameData.gameConfigs = gameConfigs;
function initPlaceBetConsumer() {
    return new PlaceBetConsumer(definition, gameData);
}

describe("adjustBetTracks test", () => {
    const testCases = [
        [{}, { betChoice: "specific1", amount: 10 }, { specific1: { 10: 1 } }],
        [{ specific1: { 10: 1 } }, { betChoice: "specific1", amount: 10 }, { specific1: { 10: 2 } }],
        [{ specific1: { 1: 1 } }, { betChoice: "specific1", amount: 10 }, { specific1: { 1: 1, 10: 1 } }],
    ];

    it.each(testCases)("should update player's chips correctly", (initialChips, bet, expetedChips) => {
        gameData.ingame.player = {
            betTracks: {},
            chips: initialChips,
        };
        const consumer = initPlaceBetConsumer();

        consumer.adjustBetTracks("player", bet);
        expect(initialChips).toEqual(expetedChips);
    });

    afterEach(() => {
        gameData.ingame = {};
    });
});

describe("composeBettingTimeValidationCriteria tests", () => {
    it("remaining is bigger than place bet time, return result containing cannotPlaceBet", () => {
        gameData.remainingTime = definition.durations.placingBets + 1;

        const consumer = initPlaceBetConsumer();

        const result = consumer.composeBettingTimeValidationCriteria();
        expect(result).toContainEqual({ failure: true, notice: consumer.getNoticeObj(helpers.noticeHelper.cannotPlaceBet) });
    });

    it("remaining is less than locking bet time, return result containing  placeBetNextRound", () => {
        gameData.remainingTime = definition.durations.lockingBet - 1;
        const consumer = initPlaceBetConsumer();

        const result = consumer.composeBettingTimeValidationCriteria();
        expect(result).toContainEqual({ failure: true, notice: consumer.getNoticeObj(helpers.noticeHelper.placeBetNextRound) });
    });
});

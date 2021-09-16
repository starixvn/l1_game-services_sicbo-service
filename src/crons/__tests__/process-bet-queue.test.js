import ProcessBetQueue from "../process-bet-queue";
import gameSettings from "../../game-settings";
import { Table } from "sc-game-base";

jest.mock("sc-game-base/src/core/event-publishers");

const definition = new Table.TableGameDefinition(gameSettings);
const gameData = new Table.TableGameData(gameSettings.durations.placingBets - 1);

beforeEach(() => {
    gameData.ingame = {
        player01: {
            name: "player01",
            betTracks: {},
            betQueue: [],
        },
    };
});

describe("decrease bet tracks test", () => {
    const testData = [
        [{ specific1: { 100: 2 } }, { betChoice: "specific1", amount: 100 }, { specific1: { 100: 1 } }],
        [
            { specific1: { 100: 2 }, specific2: { 10: 1 } },
            { betChoice: "specific1", amount: 100 },
            { specific1: { 100: 1 }, specific2: { 10: 1 } },
        ],
    ];
    it.each(testData)("should reduce player's chips correctly", (chips, bet, expectedChips) => {
        gameData.ingame.player01.chips = chips;
        const betQueue = new ProcessBetQueue({ definition, gameData });
        betQueue.decreaseBetTracks("player01", bet);
        expect(chips).toEqual(expectedChips);
    });
});

describe("generatePlacingBetResult tests", () => {
    it("result should include ownChip", () => {
        const bet = { betChoice: "specific1", amount: 100 };
        const betQueue = new ProcessBetQueue({ definition, gameData });
        const player = {
            profile: {
                name: "player01",
            },
        };
        const result = betQueue.generatePlacingBetResult(player, {}, bet);
        expect(result.ownChip).toEqual(bet);
    });
});

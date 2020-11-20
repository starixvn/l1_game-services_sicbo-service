import { Table } from "sc-game-base";

import appConfigs from "./app-configs";
import { Bot, GameCron } from "./crons";
import gameSettings from "./game-settings";
import { DiceRandom } from "./helpers";
import { betLogs, bets, rounds, tmpBets } from "./models";
import Startup from "./startup";

const generateResult = () => {
    return { dice1: DiceRandom.random(), dice2: DiceRandom.random(), dice3: DiceRandom.random() };
};

const sum = (total, num) => {
    return total + num;
};

const settlementRuleEntries = Object.entries({
    specific1: (resultArray) => resultArray.includes(1),
    specific2: (resultArray) => resultArray.includes(2),
    specific3: (resultArray) => resultArray.includes(3),
    specific4: (resultArray) => resultArray.includes(4),
    specific5: (resultArray) => resultArray.includes(5),
    specific6: (resultArray) => resultArray.includes(6),
    big: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total > 10;
    },
    small: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total <= 10;
    },
    total4: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 4;
    },
    total5: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 5;
    },
    total6: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 6;
    },
    total7: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 7;
    },
    total8: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 8;
    },
    total9: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 9;
    },
    total10: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 10;
    },
    total11: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 11;
    },
    total12: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 12;
    },
    total13: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 13;
    },
    total14: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 14;
    },
    total15: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 15;
    },
    total16: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 16;
    },
    total17: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total === 17;
    },
});

const getSettlementResult = (roundResult) => {
    const resultArray = Object.values(roundResult);

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(resultArray);

        return result;
    }, {});
};

const run = async () => {
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);

    const definition = new Table.TableGameDefinition(gameSettings, generateResult, getSettlementResult, rounds, bets, tmpBets, betLogs);

    const gameCron = new GameCron(definition, gameData, new Bot(definition, gameData));
    const startup = new Startup(appConfigs, definition, gameData, gameCron);
    const app = new Table.TableGameApp(appConfigs, definition, gameData, startup);

    await app.run();
};

run();

import Chance from "chance";
import randomLib1 from "random";
import { Random, MersenneTwister19937 } from "random-js";

const random3 = () => {
    const chance = new Chance();
    return chance.integer({ min: 1, max: 6 });
};

const random4 = () => {
    return randomLib1.int(1, 6);
};

const random5 = () => {
    const randomJS = new Random(MersenneTwister19937.autoSeed());
    return randomJS.integer(1, 6);
};

const randomFunctions = [random3, random4, random5];

const random = () => {
    const selectedRandomMethodIndex = Math.floor(Math.random() * randomFunctions.length);
    const randomFunction = randomFunctions[selectedRandomMethodIndex];

    return randomFunction();
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
        return total > 10 && !resultArray.every((dice) => dice === resultArray[0]);
    },
    small: (resultArray) => {
        const total = resultArray.reduce(sum);
        return total <= 10 && !resultArray.every((dice) => dice === resultArray[0]);
    },
    anyTriple: (resultArray) => resultArray.every((dice) => dice === resultArray[0]),
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

const generateResult = () => {
    return { dice1: random(), dice2: random(), dice3: random() };
};

const getSettlementResult = (roundResult) => {
    const resultArray = Object.values(roundResult);

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(resultArray);

        return result;
    }, {});
};

export { generateResult, getSettlementResult };

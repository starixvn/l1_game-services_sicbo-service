import Chance from "chance";
import { userInfos } from "sc-base-database";
import { helpers } from "sc-common";
import { Core } from "sc-game-base";

export default class Bot extends Core.Crons.BaseBot {
    constructor(definition, gameData) {
        super(definition, gameData, null);

        this.betChoiceRatio = { MainOpts: 52, SubOpts: 30, AnyTripleOpts: 2, TotalOpts1: 10, TotalOpts2: 6 };

        this.chance = new Chance();
        this.mainOpts = ["big", "small"];
        this.subOpts = ["specific1", "specific2", "specific3", "specific4", "specific5", "specific6"];
        this.anyTripleOpts = ["anyTriple"];
        this.totalOpts1 = ["total8", "total9", "total10", "total11", "total12", "total13"];
        this.totalOpts2 = ["total4", "total5", "total6", "total7", "total14", "total15", "total16", "total17"];

        this.smallTicketRatio = 70;
        this.smallTickets = 0;
        this.botList = [];
        this.oddTicketRatio = 20;
        this.oddTickets = 0;
    }

    async reset() {
        await super.reset();

        const configs = this.gameData.gameConfigs;

        if (configs?.botenabled) {
            const bots = await userInfos.find({ type: true, disabled: false }, "id name red").lean().exec();
            this.botList = this.chance.shuffle(bots).slice(0, this.maxNumberOfBots);
        } else {
            this.botList = [];
        }
    }

    async run() {
        if (
            !!this.botList.length &&
            this.gameData.gameConfigs?.botenabled &&
            this.gameData.remainingTime > this.definition.durations.lockingBet
        ) {
            const maxBotRandom = this.botList.length / this.gameData.remainingTime;
            const botsToBet = this.chance.integer({ min: (maxBotRandom * 2) / 3, max: maxBotRandom });

            let botsToRemove = [];

            for (let i = 0; i < botsToBet; i++) {
                const bot = this.botList[i];
                if (bot) {
                    await this.placeBet(bot);
                    botsToRemove.push(i);
                }
            }

            botsToRemove.forEach((index) => {
                this.botList.splice(index, 1);
            });
        }
    }

    async placeBet(bot) {
        const choice = this.getBetChoice(bot);
        const minBet = this.getMinBet();
        const maxBet = this.getMaxBet(bot, choice);
        const isOddTicket = this.totalTickets === 0 ? false : (this.oddTickets * 100) / this.totalTickets < this.oddTicketRatio;
        const betAmount = this.getBetAmount(minBet, maxBet, isOddTicket);

        if (this.gameData.remainingTime > this.definition.durations.lockingBet) {
            this.gameData.totalBets[choice] = this.gameData.totalBets[choice] ? this.gameData.totalBets[choice] + betAmount : betAmount;
            this.allBets[choice] += betAmount;

            this.totalTickets++;

            if (this.isSmallTicket(betAmount)) {
                this.smallTickets++;
            }

            if (isOddTicket) {
                this.oddTickets++;
            }
        }
    }

    async removeAllBots() {
        this.maxNumberOfBots = 0;
        this.currentBotRatio = 0;
        this.botList = [];
    }

    resetAllBotData() {
        super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.allBets = {
            big: 0,
            small: 0,
            specific1: 0,
            specific2: 0,
            specific3: 0,
            specific4: 0,
            specific5: 0,
            specific6: 0,
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
        };

        this.smallTickets = 0;
        this.oddTickets = 0;
    }

    getBetAmount(minBet, maxBet, isOdd) {
        return isOdd ? this.chance.floating({ min: minBet, max: maxBet, fixed: 2 }) : this.chance.integer({ min: minBet, max: maxBet });
    }

    getBetChoice(bot) {
        const totalBotBet = this.getAllBetAmount();

        const betChoiceRatios = [
            {
                group: this.mainOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.mainOpts) * 100) / totalBotBet < this.betChoiceRatio.MainOpts,
            },
            {
                group: this.subOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.subOpts) * 100) / totalBotBet < this.betChoiceRatio.SubOpts,
            },
            {
                group: this.anyTripleOpts,
                underBetRatio:
                    (this.getTotalAmountOnChoiceGroup(this.anyTripleOpts) * 100) / totalBotBet < this.betChoiceRatio.AnyTripleOpts,
            },
            {
                group: this.totalOpts1,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.totalOpts1) * 100) / totalBotBet < this.betChoiceRatio.TotalOpts1,
            },
            {
                group: this.totalOpts2,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.totalOpts2) * 100) / totalBotBet < this.betChoiceRatio.TotalOpts2,
            },
        ];

        const underRatioGroups = helpers.arrayHelper.shuffle(betChoiceRatios.filter((data) => data.underBetRatio));

        const choice =
            underRatioGroups.length > 0
                ? this.getRandomChoiceFromGroup(underRatioGroups[0].group)
                : this.getRandomChoiceFromGroup(this.mainOpts);

        return choice;
    }

    getMaxBet(bot, choice) {
        const gameConfigs = this.gameData.gameConfigs;
        const minBet = this.getMinBet();
        const maxBetPerChoice = gameConfigs.choices_maxbet[choice];
        const botMaxBet = gameConfigs.bot_maxbet;
        let maxBet = Math.min(maxBetPerChoice, botMaxBet);

        const isSmallTicket = this.totalTickets === 0 ? true : (this.smallTickets * 100) / this.totalTickets < this.smallTicketRatio;
        const maxBetOfSmallTicket = Math.min(minBet * 50, botMaxBet * 0.3, maxBetPerChoice);
        maxBet = isSmallTicket ? maxBetOfSmallTicket : maxBet;

        if (this.anyTripleOpts.includes(choice) || this.totalOpts2.includes(choice)) {
            maxBet = Math.min(maxBetPerChoice, botMaxBet * 0.1);
        }

        if (this.totalOpts1.includes(choice)) {
            maxBet = Math.min(maxBetPerChoice, botMaxBet * 0.2);
        }

        return Math.max(maxBet, minBet);
    }

    getRandomChoiceFromGroup(group) {
        return this.chance.pickone(group);
    }

    getTotalAmountOnChoiceGroup(choices) {
        let total = 0;
        choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    getTotalAmountOfBotOnChoiceGroup(bot, choices) {
        let total = 0;
        choices.forEach((choice) => (total += bot.betOnChoices[choice]));

        return total;
    }

    getAllBetAmount() {
        let total = 0;
        this.definition.choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    isSmallTicket(amount) {
        return amount <= this.getMinBet() * 50;
    }
}

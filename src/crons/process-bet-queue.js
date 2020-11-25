import { Core } from "sc-game-base";

export default class ProcessBetQueue extends Core.Cron.ProcessBetQueue {
    async upsertBet(player, roundId, bet) {
        const existingBetFilter = { uid: player.UID, phien: roundId, freeBet: bet.freeBet };
        const existingBet = await this.definition.betRepository.findOne(existingBetFilter).exec();

        if (existingBet) {
            existingBet[bet.betChoice] += bet.amount;
            existingBet.totalAmount += bet.amount;
            await existingBet.save();
        } else {
            const configs = this.gameData.gameConfigs;
            const newBet = {
                uid: player.UID,
                name: player.profile.name,
                phien: roundId,
                time: new Date(),
                odds: configs.odds,
                freeBet: bet.freeBet,
            };
            const existingBetIncrement = { [bet.betChoice]: bet.amount, totalAmount: bet.amount };

            if (player.session) {
                newBet.memberId = player.session.memberId;
                newBet.siteId = player.session.siteId;
            }

            await this.definition.betRepository.updateOne(
                existingBetFilter,
                { $inc: existingBetIncrement, $setOnInsert: newBet },
                { upsert: true, setDefaultsOnInsert: true }
            );
        }
    }
}

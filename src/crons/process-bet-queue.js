import { Crons } from "sc-rebet-mode";

export default class ProcessBetQueue extends Crons.ProcessBetQueue {
    generatePlacingBetResult(player, balance, bet) {
        const { betChoice, amount } = bet;
        const result = super.generatePlacingBetResult(player, balance, bet);

        if (bet.rebet) {
            result.rebet = this.rebetProcessor.convertRebetToChipList(player, this.gameData.currencyGroupGames, bet);
        } else {
            result.ownChip = { betChoice, amount };
        }

        return result;
    }

    decreaseBetTracks(player, bet) {
        if (bet.rebet) {
            const rebetChips = this.rebetProcessor.convertRebetToChipList(player, this.gameData.currencyGroupGames, bet);
            for (const [betChoice, chips] of Object.entries(rebetChips)) {
                for (const [amount, count] of Object.entries(chips)) {
                    for (let i = 0; i < count; i++) {
                        this.decreaseSingleBetTracks(player.profile.name, { betChoice, amount });
                    }
                }
            }
        } else {
            this.decreaseSingleBetTracks(player.profile.name, bet);
        }
    }

    decreaseSingleBetTracks(playerName, bet) {
        const { betChoice, amount } = bet;

        const playerInGame = this.gameData?.ingame[playerName];
        if (playerInGame) {
            playerInGame.betTracks[betChoice] -= amount;
        }
        if (playerInGame && playerInGame.chips && playerInGame.chips[betChoice] && playerInGame.chips[betChoice][amount]) {
            playerInGame.chips[betChoice][amount] -= 1;
        }
    }

    async insertBetLog(player, roundId, bet, rate) {
        if (bet.rebet) {
            Object.entries(bet.lastBet).forEach(
                async ([betChoice, amount]) => await this.insertSingleBetLog(player, roundId, { betChoice, amount }, rate, true)
            );
        } else {
            await this.insertSingleBetLog(player, roundId, bet, rate, false);
        }
    }

    async insertSingleBetLog(player, roundId, bet, rate, isRebet) {
        const newBetLog = {
            uid: player.UID,
            name: player.profile.name,
            time: new Date(),
            choice: bet.betChoice,
            amount: bet.amount,
            freeBet: bet.freeBet,
            clientSentTime: bet.clientSentTime,
            receivedTime: bet.receivedTime,
            roundId,
            rebet: isRebet,
        };

        if (player.session) {
            newBetLog.siteId = player.session.siteId;
            newBetLog.currency = player.session.currencyName;
            newBetLog.rate = rate;
            newBetLog.operatorId = player.session.operatorId;
            newBetLog.playerId = player.session.playerId;
        }

        await this.betLogsRepository.create(newBetLog);
    }
}

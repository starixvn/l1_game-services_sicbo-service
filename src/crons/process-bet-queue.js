import { Core } from "sc-game-base";

export default class ProcessBetQueue extends Core.Cron.ProcessBetQueue {
    generatePlacingBetResult(player, balance, bet) {
        const { betChoice, amount } = bet;
        const ownBet = super.generatePlacingBetResult(player, balance, bet);

        ownBet.ownChip = { betChoice, amount };

        return ownBet;
    }

    decreaseBetTracks(playerName, bet) {
        super.decreaseBetTracks(playerName, bet);

        const { betChoice, amount } = bet;

        if (this.gameData.ingame?.[playerName]) {
            const playerInGame = this.gameData.ingame[playerName];

            playerInGame.chips = playerInGame.chips ?? {};
            playerInGame.chips[betChoice] = playerInGame.chips[betChoice] ?? {};
            playerInGame.chips[betChoice][amount] -= 1;
        }
    }
}

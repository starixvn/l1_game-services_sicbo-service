import { Consumers } from "sc-rebet-mode";

export default class RebetConsumer extends Consumers.RebetConsumer {
    constructor(definition, gameData, publisher, betsRepository, rebetProcessor) {
        super(definition, gameData, publisher, betsRepository);

        this.rebetProcessor = rebetProcessor;
    }

    adjustBetTracks(player, lastBet) {
        if (this.gameData.ingame?.[player.profile.name]) {
            const playerInGame = this.gameData.ingame[player.profile.name];

            Object.entries(lastBet).forEach(([betChoice, amount]) => {
                playerInGame.betTracks[betChoice] = (playerInGame.betTracks[betChoice] ?? 0) + amount;
            });

            const rebetChips = this.rebetProcessor.convertRebetToChipList(player, this.gameData.currencyGroupGames, { lastBet });
            playerInGame.chips = playerInGame.chips ?? {};
            for (const [betChoice, chips] of Object.entries(rebetChips)) {
                for (const [amount, count] of Object.entries(chips)) {
                    playerInGame.chips[betChoice] = playerInGame.chips[betChoice] ?? {};
                    playerInGame.chips[betChoice][amount] = (playerInGame.chips[betChoice][amount] ?? 0) + count;
                }
            }
        }
    }
}

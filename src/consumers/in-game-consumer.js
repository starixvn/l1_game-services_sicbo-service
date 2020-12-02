import { Core } from "sc-game-base";

export default class InGameConsumer extends Core.BaseEventConsumers.InGameConsumer {
    async buildPayload(realPlayer) {
        const payload = await super.buildPayload(realPlayer);

        const { chips } = this.gameData.ingame[realPlayer.profile.name] || { chips: {} };

        return {
            ...payload,
            chips,
        };
    }
}

import gameSettings from "../../game-settings";
import GameCron from "../game-cron";

describe("isStartingTime tests", () => {
    it("remaining time = place bet time + shake time, should re turn true", () => {
        const { durations } = gameSettings;
        const gameCron = new GameCron({});
        const result = gameCron.isStartingTime(durations.placingBets + durations.shakeThePlateDuration, durations);
        expect(result).toBeTrue();
    });
});

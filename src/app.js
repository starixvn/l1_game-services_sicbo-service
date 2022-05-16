import { Core } from "sc-game-base";

import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { generateResult, getSettlementResult, generateRawResultForHash } from "./helpers/result-helper";
import SicboContainerRegistry from "./sicbo-container-registry";

const run = async () => {
    const definition = new Core.GameDefinition(gameSettings, generateResult, getSettlementResult, generateRawResultForHash);
    const gameData = new Core.GameData(gameSettings.durations.wholeRound);

    const container = new SicboContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("SicBo", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();

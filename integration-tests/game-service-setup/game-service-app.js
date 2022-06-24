import { Core } from "sc-game-base";
import { initAPIStub, stubUserService } from "sc-game-service-integration-utils";

import appConfigs from "./../../src/app-configs.IGT";
import SicboContainerRegistry from "./../../src/sicbo-container-registry";
import gameSettings from "./../../src/game-settings";
import * as resultHelper from "./../../src/helpers";

export const run = async () => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    stubUserService(appConfigs);

    const definition = new Core.GameDefinition(
        gameSettings,
        resultHelper.generateResult,
        resultHelper.getSettlementResult,
        resultHelper.generateRawResultForHash
    );
    const gameData = new Core.GameData(gameSettings.durations.wholeRound);

    const container = new SicboContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("SicBo", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();

import mongoose from "mongoose";
import { middlewares } from "sc-common";
import { Core } from "sc-game-base";

import appConfigs from "./app-configs";
import { PlaceBetConsumer } from "./consumers";

export default class Startup extends Core.BaseStartup {
    async configureServices(app) {
        super.configureServices(app);

        await middlewares.database.configureDatabase(mongoose, appConfigs.database);
    }

    initSocketRouter(socketClient) {
        const router = new Core.Routers.BaseSocketRouter({
            definition: this.definition,
            gameData: this.gameData,
            placeBetConsumer: new PlaceBetConsumer(this.definition, this.gameData),
        });

        router.init(socketClient);
    }
}

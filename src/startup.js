import mongoose from "mongoose";
import { middlewares } from "sc-common";
import { Table } from "sc-game-base";

import appConfigs from "./app-configs";
import { PlaceBetConsumer } from "./consumers";

export default class Startup extends Table.TableGameStartup {
    async configureServices(app) {
        super.configureServices(app);

        await middlewares.database.configureDatabase(mongoose, appConfigs.database);
    }

    initSocketRouter(socketClient) {
        const router = new Table.Routers.SocketRouter({
            definition: this.definition,
            gameData: this.gameData,
            placeBetConsumer: new PlaceBetConsumer(this.definition, this.gameData),
        });

        router.init(socketClient);
    }
}

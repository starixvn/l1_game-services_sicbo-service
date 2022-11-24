import awilix from "awilix";
import { Core, Table } from "sc-game-base";

import { SicboInGameConsumer, SicboPlaceBetConsumer, SicboSettleGameRoundConsumer, RebetConsumer } from "./consumers";
import { SicboBot, SicboGameCron, SicboProcessBetQueue } from "./crons";
import { SicboBetLogs, SicboBets, SicboRounds, SicboResults } from "./models";
import { RebetContainerRegistry } from "sc-rebet-mode";

const { asClass, asValue } = awilix;

export default class SicboContainerRegistry extends Core.ContainerRegistry {
    register(appConfigs, definition, gameData) {
        super.register(appConfigs, definition, gameData);

        this.container.register(new RebetContainerRegistry().registerTableGame(Core.Routers.BaseSocketRouter));
        this.container.register({
            rebetConsumer: asClass(RebetConsumer).singleton(),
            processBetQueue: asClass(SicboProcessBetQueue).singleton().proxy(),
            placeBetPublisher: asClass(Core.BaseEventPublishers.PlaceBetPublisher).singleton(),
        });

        return this.container;
    }

    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(SicboRounds),
            betsRepository: asValue(SicboBets),
            betLogsRepository: asValue(SicboBetLogs),
            resultsRepository: asValue(SicboResults),
        });
    }

    registerPublishers() {
        super.registerPublishers();

        this.container.register({
            userSignInPublisher: asClass(Table.EventPublishers.TableUserSignInPublisher).singleton(),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            placeBetConsumer: asClass(SicboPlaceBetConsumer).singleton(),
            inGameConsumer: asClass(SicboInGameConsumer).singleton(),
            userSignInConsumer: asClass(Table.EventConsumers.TableUserSignInConsumer).singleton(),
            settleGameRoundConsumer: asClass(SicboSettleGameRoundConsumer).singleton().proxy(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(SicboBot).singleton(),
            gameCron: asClass(SicboGameCron).singleton().proxy(),
            processBetQueue: asClass(SicboProcessBetQueue).singleton().proxy(),
        });
    }
}

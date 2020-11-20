import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment-reworked";

const modelName = "SicBo_phien";

const resultSchema = new mongoose.Schema(
    {
        dice1: { type: Number, required: true },
        dice2: { type: Number, required: true },
        dice3: { type: Number, required: true },
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        specific1: { type: Boolean, default: false },
        specific2: { type: Boolean, default: false },
        specific3: { type: Boolean, default: false },
        specific4: { type: Boolean, default: false },
        specific5: { type: Boolean, default: false },
        specific6: { type: Boolean, default: false },
        big: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
        anyTriple: { type: Boolean, default: false },
        total4: { type: Boolean, default: false },
        total5: { type: Boolean, default: false },
        total6: { type: Boolean, default: false },
        total7: { type: Boolean, default: false },
        total8: { type: Boolean, default: false },
        total9: { type: Boolean, default: false },
        total10: { type: Boolean, default: false },
        total11: { type: Boolean, default: false },
        total12: { type: Boolean, default: false },
        total13: { type: Boolean, default: false },
        total14: { type: Boolean, default: false },
        total15: { type: Boolean, default: false },
        total16: { type: Boolean, default: false },
        total17: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
});

Schema.plugin(autoIncrement.MongooseAutoIncrementID.plugin, { modelName, field: "id" });

export default mongoose.model(modelName, Schema);

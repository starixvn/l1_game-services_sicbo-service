import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },

    specific1: { type: Number, default: 0 },
    specific2: { type: Number, default: 0 },
    specific3: { type: Number, default: 0 },
    specific4: { type: Number, default: 0 },
    specific5: { type: Number, default: 0 },
    specific6: { type: Number, default: 0 },
    big: { type: Number, default: 0 },
    small: { type: Number, default: 0 },
    anyTriple: { type: Number, default: 0 },
    total4: { type: Number, default: 0 },
    total5: { type: Number, default: 0 },
    total6: { type: Number, default: 0 },
    total7: { type: Number, default: 0 },
    total8: { type: Number, default: 0 },
    total9: { type: Number, default: 0 },
    total10: { type: Number, default: 0 },
    total11: { type: Number, default: 0 },
    total12: { type: Number, default: 0 },
    total13: { type: Number, default: 0 },
    total14: { type: Number, default: 0 },
    total15: { type: Number, default: 0 },
    total16: { type: Number, default: 0 },
    total17: { type: Number, default: 0 },

    totalAmount: { type: Number, default: 0 },
    thanhtoan: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    memberId: { type: Number },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
});

export default mongoose.model("SicBo_one", schema);

import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },

    specific1: { type: Number },
    specific2: { type: Number },
    specific3: { type: Number },
    specific4: { type: Number },
    specific5: { type: Number },
    specific6: { type: Number },
    big: { type: Number },
    small: { type: Number },
    anyTriple: { type: Number },
    total4: { type: Number },
    total5: { type: Number },
    total6: { type: Number },
    total7: { type: Number },
    total8: { type: Number },
    total9: { type: Number },
    total10: { type: Number },
    total11: { type: Number },
    total12: { type: Number },
    total13: { type: Number },
    total14: { type: Number },
    total15: { type: Number },
    total16: { type: Number },
    total17: { type: Number },

    totalAmount: { type: Number, default: 0 },
    thanhtoan: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    memberId: { type: Number },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
});

const bets = mongoose.model("SicBo_one", schema);
const tmpBets = mongoose.model("SicBo_tmpone", schema);

export { bets, tmpBets };

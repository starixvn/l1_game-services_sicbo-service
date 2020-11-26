import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },

    choice: { type: String, required: true },
    amount: { type: Number, required: true },

    thanhtoan: { type: Boolean, default: false },
    win: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },

    memberId: { type: Number },
    siteId: { type: String },
});

export default mongoose.model("SicBo_cuoc", Schema);

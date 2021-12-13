import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },

    choice: { type: String, required: true },
    amount: { type: Number, required: true },

    time: { type: Date },

    memberId: { type: Number },
    siteId: { type: String },

    currency: { type: String, require: true },
    rate: { type: Number, require: true },
    partnerId: { type: String, require: true },
});

export default mongoose.model("SicBo_cuoc", Schema);

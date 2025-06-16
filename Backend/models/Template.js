import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    temname: {
        type: String,
        required: true,

    },
    camname: {
        type: String,
    },
    previewContent: {
        type: Array,
        required: true,
    },
    bgColor: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

}, {
    timestamps: true
});


const Template = mongoose.model("Template", templateSchema);
export default Template;
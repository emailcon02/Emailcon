import mongoose from "mongoose";

const birthdaytemplateSchema = new mongoose.Schema({
    temname: {
        type: String,
        required: true,

    },
    camname: {
        type: String,
        required: true,
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


const BirthdayTemplate = mongoose.model("BirthdayTemplate", birthdaytemplateSchema);
export default BirthdayTemplate;
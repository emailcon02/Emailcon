import mongoose from "mongoose";

const replytoSchema = new mongoose.Schema({
    replyTo: {
        type: String,
        required: true,

    },
     user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
     },
    
}, {
    timestamps: true
});

const Replyto = mongoose.model("Replyto", replytoSchema);
export default Replyto;

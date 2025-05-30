import mongoose from "mongoose";

const aliasnameSchema = new mongoose.Schema({
    aliasname: {
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

const Aliasname = mongoose.model("Aliasname", aliasnameSchema);
export default Aliasname;

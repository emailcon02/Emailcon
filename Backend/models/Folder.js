import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
     user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
     },
     name: { type: String, required: true },   
}, {
    timestamps: true
});

const Folder = mongoose.model("Folder", FolderSchema);
export default Folder;

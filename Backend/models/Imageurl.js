import mongoose from "mongoose";

const imageUrlSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,

    },
     user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
     },
       folderName: { type: String },

    
}, {
    timestamps: true
});

const ImageUrl = mongoose.model("ImageUrl", imageUrlSchema);
export default ImageUrl;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    phone: { type: Number },
    role:{ type: String },
    smtppassword: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/847/847969.png"
    },
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;

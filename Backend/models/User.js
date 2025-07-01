import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String},
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    phone: { type: Number },
    role:{ type: String },
    smtppassword: { type: String},
    google: {
    refreshToken: String,
    accessToken: String,
    expiryDate: Number,
    tokenType: String
  },
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

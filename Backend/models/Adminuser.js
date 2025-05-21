import mongoose from "mongoose";

const adminuserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    role: String,
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Adminuser = mongoose.model("Adminuser", adminuserSchema);
export default Adminuser;

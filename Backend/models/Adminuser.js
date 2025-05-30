import mongoose from "mongoose";

const adminuserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    role: String,
    isActive: { type: Boolean, default: false },
}, {
    timestamps: true
});

const Adminuser = mongoose.model("Adminuser", adminuserSchema);
export default Adminuser;

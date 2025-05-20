import mongoose from "mongoose";

const adminuserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String, // ideally hashed
    role: String
});

const Adminuser = mongoose.model("Adminuser", adminuserSchema);
export default Adminuser;

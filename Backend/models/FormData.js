// models/FormData.js
import mongoose from "mongoose";
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  gender: String,
  profession: String,
});

const FormData = mongoose.model("FormData", formDataSchema);
export default FormData;
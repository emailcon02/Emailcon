import mongoose from "mongoose";

const formDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  type: { type: String, enum: ["organization", "individual"], required: true },
  profession: { type: String, required: true },
  status: { type: String, enum: ["pending", "purchased", "not interested"], default: "pending" },
  remarks: { type: String, default: "" },
}
, {
  timestamps: true,
});

const FormData = mongoose.model("FormData", formDataSchema);
export default FormData;
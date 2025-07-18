import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    Fname: {
        type: String,
    },
    Lname: {
        type: String,
    },
    Email: {
        type: String,
    },
    additionalFields: {
        type: Map,
        of: String,
    },
    user: {
             type: mongoose.Schema.Types.ObjectId,
             ref: "User",
         },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
    lastSentYear: { 
        type: Number,
        default: 0,
    },
         isUnsubscribed: {
    type: Boolean,
    default: false, 
  },
}, { 
    strict: false,
    versionKey: false, 
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;

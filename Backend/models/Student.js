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
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
    lastSentYear: { 
        type: Number,
        default: 0,
    }
}, { 
    strict: false,
    versionKey: false 
});

const Student = mongoose.model('Student', studentSchema);

export default Student;

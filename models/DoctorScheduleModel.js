import mongoose from "mongoose";

const DoctorScheduleSchema = new mongoose.Schema({

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    morningStart: {
        type: String,
        default: "10:00"
    },

    morningEnd: {
        type: String,
        default: "13:00"
    },

    eveningStart: {
        type: String,
        default: "18:00"
    },

    eveningEnd: {
        type: String,
        default: "21:00"
    },

    slotDuration: {
        type: Number,
        default: 30
    }

}, { timestamps: true });

const DoctorScheduleModel = mongoose.model(
    "doctorSchedules",
    DoctorScheduleSchema
);

export default DoctorScheduleModel;
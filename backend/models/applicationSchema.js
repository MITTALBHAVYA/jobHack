import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
    jobSeekerInfo: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: [true, "PLEASE ENTER THE NAME"],
            minLength: [3, "NAME MUST CONTAIN ATLEAST 3 CHARACTERS"],
            maxLength: [30, "NAME MUST CONTAIN ATMOST 30 CHARACTERS"],
        },
        email: {
            type: String,
            required: [true, "PLEASE ENTER THE EMAIL"],
            validate: [validator.isEmail, "PLEASE ENTER A VALID EMAIL"],
        },
        phone: {
            type: Number,
            required: [true, "PLEASE ENTER THE PHONE NUMBER"],
        },
        address: {
            type: String,
            required: [true, "PLEASE ENTER THE ADDRESS"],
        },
        resume: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        coverLetter: {
            type: String,
            required: [true, "PLEASE ENTER THE COVER LETTER"],
        },
        role: {
            type: String,
            enum: ["JOB SEEKER"],
            required: true
        }
    },
    employerInfo: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["EMPLOYER"],
            required: true
        },
    },
    jobInfo: {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        jobTitle: {
            type: String,
            required: true,
        },
    },
    deletedBy: {
        jobSeeker: {
            type: Boolean,
            default: false,
        },
        employer: {
            type: Boolean,
            default: false,
        },
    },
});

export const Application = mongoose.model("Application", applicationSchema);
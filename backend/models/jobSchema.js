import mongoose from "mongoose";
import validator from "validator";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        required: true,
        enum: ["Full-time", "Part-time", "Other"],
    },
    location: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    introduction: {
        type: String,
    },
    responsibilities: {
        type: String,
        required: true,
    },
    qualifications: {
        type: String,
        required: true,
    },
    offers: {
        type: String,
    },
    salary: {
        type: String,
        required: true,
    },
    hiringMultipleCandidates: {
        type: String,
        default: "No",
        enum: ["Yes", "No"],
    },
    personalWebsite: {
        title: {
            type: String,
        },
        url: {
            type: String,
            validate: {
                validator: function(value) {
                    // Validate URL using the validator library
                    return validator.isURL(value);
                },
                message: props => `${props.value} is not a valid URL!`
            }
        }
    },
    jobNiche: {
        type: String,
        required: true,
    },
    newsLettersSent: {
        type: Boolean,
        default: false,
    },
    jobPostedOn: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    expired: {
        type: Boolean,
        default: false
    }
});

export const Job = mongoose.model("Job", jobSchema);

import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
    name: {
        type : String,
        required:[true,"PLEASE ENTER THE NAME"],
        minLength:[3,"NAME MUST CONTAIN ATLEAST 3 CHARACTERS"],
        maxLength:[30,"NAME MUST CONTAIN ATMOST 30 CHARACTERS"],
    },
    email: {
        type : String,
        required:[true,"PLEASE ENTER THE EMAIL"],
        validate:[validator.isEmail,"PLEASE ENTER A VALID EMAIL"],
    },
    coverLetter: {
        type:String,
        required:[true,"PLEASE ENTER THE COVER LETTER"],
    },
    phone:{
        type: Number,
        required:[true,"PLEASE ENTER THE PHONE NUMBER"],
    },
    address:{
        type:String,
        required:[true,"PLEASE ENTER THE ADDRESS"],
    },
    resume:{
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    applicantId:{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type:String,
            enum:["JOB SEEKER"],
            required:true
        }
    },
    employeeId:{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type:String,
            enum:["EMPLOYEER"],
            required:true
        },
    },
});

export const Application = mongoose.model("Application", applicationSchema);
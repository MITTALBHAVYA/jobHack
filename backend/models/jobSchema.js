import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        required:[true,"PLEASE ENTER THE JOB TITLE"],
        minLength:[3,"JOB TITLE MUST CONTAIN ATLEAST 3 CHARACTERS"],
        maxLength:[30,"JOB TITLE MUST CONTAIN ATMOST 30 CHARACTERS"],
    },
    description : {
        type:String,
        required:[true,"PLEASE ENTER THE JOB DESCRIPTION"],
        minLength:[3,"JOB DESCRIPTION MUST CONTAIN ATLEAST 3 CHARACTERS"],
        maxLength:[350,"JOB DESCRIPTION MUST CONTAIN ATMOST 350 CHARACTERS"],
    },
    category:{
        type:String,
        required:[true,"ENTER JOB CATEGORY"],
    },
    country : {
        type:String,
        required:[true,"ENTER THE COUNTRY"]
    },
    location:{
        type:String,
        required:[true,"ENTER THE JOB LOCATION"],
        minLength:[5,"Location at least contain 5 characters"],
    },
    fixedSalary:{
        type:Number,
        minLength:[4,"SALARY SHOULD MORE THAN 3 digits"],
    },
    salaryFrom:{
        type:Number,
        minLength:[4,"SALARY SHOULD MORE THAN 3 digits"],
    },
    salaryTo:{
        type:Number,
        minLength:[4,"SALARY SHOULD MORE THAN 3 digits"],
        validate:[function(){
            return this.salaryTo>this.salaryFrom;
          },"salaryTo should be greater than salaryFrom"]
    },
    expired:{
        type:Boolean,
        default:false
    },
    jobPostedOn:{
        type:Date,
        default:Date.now,
    },
    jobPostedBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }
});

export const Job = mongoose.model("Job",jobSchema);
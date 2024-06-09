import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js";
import {Job} from "../models/jobSchema.js";

export const getAllJobs = catchAsyncError(async(req,res,next)=>{
    const jobs = await Job.find({expired:false});
    if(!jobs){
        return next(new ErrorHandler("NO JOBS FOUND",400));
    }
    res.status(200).json({
        success:true,
        jobs,
    })
});

export const postJob = catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role!=="EMPLOYEER"){
        return next(new ErrorHandler("ONLY EMPLOYEER ARE ALLOWED TO POST JOBS!",400));
    }
    const {title,description,category,country,location,fixedSalary,salaryFrom,salaryTo,expired,jobPostedOn}=req.body;
    if(!title||!description||!category||!country||!location){
        return next(new ErrorHandler("Please provide full job details",400));
    }
    if((!salaryFrom || !salaryTo)&&!fixedSalary){
        return next(new ErrorHandler("Please enter fixed salary or salary range",400));
    }
    if(salaryFrom && salaryTo && fixedSalary){
        return next(new ErrorHandler("Please enter either fixed salary or salary range",400));
    }
    const jobPostedBy=req.user._id;
    const job = await Job.create({
        title,
        description,
        category,
        country,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        expired,
        jobPostedOn,
        jobPostedBy
    })
    res.status(200).json({
        success:true,
        message:"JOB POSTED SUCCESSFULLY!",
        job
    })
});
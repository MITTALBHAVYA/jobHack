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
    if(role!=="EMPLOYER"){
        return next(new ErrorHandler("ONLY EMPLOYER ARE ALLOWED TO POST JOBS!",400));
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
    });
});

export const getMyJobs= catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role!=="EMPLOYER"){
        return next(new ErrorHandler("ONLY EMPLOYER CAN ACCESS RESOURCES",400));
    }
    const jobPostedBy=req.user._id;
    const myJobs = await Job.find({jobPostedBy:jobPostedBy});
    res.status(200).json({
        success:true,
        message:"HERE ARE THE JOBS ",
        myJobs
    })
});

export const updateJob = catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role!=="EMPLOYER"){
        return next(new ErrorHandler("ONLY EMPLOYER CAN ACCESS RESOURCES",400));
    }
    const {jobId}=req.params;
    // console.log(jobId);
    let job  = await Job.findById(jobId);
    if(!job){
        return next(new ErrorHandler("JOB NOT FOUND",404));
    }
    job  = await Job.findByIdAndUpdate(jobId,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        message:"JOB UPDATED SUCCESSFULLY",
        job
    });
});

export const deleteJob = catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role!=="EMPLOYER"){
        return next(new ErrorHandler("ONLY EMPLOYER CAN ACCESS RESOURCES",400));
    }
    const {jobId}=req.params;
    let job  = await Job.findById(jobId);
    if(!job){
        return next(new ErrorHandler("JOB NOT FOUND",404));
    }
    job  = await Job.findByIdAndDelete(jobId);
    res.status(200).json({
        success:true,
        message:"JOB DELETED SUCCESSFULLY",
    });
});

export const getJob = catchAsyncError(async(req,res,next)=>{
    const {jobId}=req.params;
    try{
        const job = await Job.findById(jobId);
        if(!job){
            return next(new ErrorHandler("JOB NOT FOUND",404));
        }
        res.status(200).json({
            success:true,
            job,
        });
    }
    catch(err){
        return next(new ErrorHandler(err.message,404));
    }
});
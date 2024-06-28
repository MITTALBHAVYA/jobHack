import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import {Job} from "../models/jobSchema.js";
import cloudinary from "cloudinary";

export const empGetAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role === "JOB SEEKER"){
        return next(new ErrorHandler("ONLY EMPLOYER CAN ACCESS RESOURCES",400));
    }
    const {_id} = req.user;
    const applications = await Application.find({"employeeId.user":_id});
    res.status(200).json({
        success:true,
        applications,
    });
});

export const jobGetAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role === "EMPLOYER"){
        return next(new ErrorHandler("ONLY JOB SEEKER CAN ACCESS RESOURCES",400));
    }
    const {_id} = req.user;
    const applications = await Application.find({"applicantId.user":_id});
    res.status(200).json({
        success:true,
        applications,
    });
});

export const jobDeleteApplication = catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role === "EMPLOYER"){
        return next(new ErrorHandler("ONLY JOB SEEKER CAN ACCESS RESOURCES",400));
    }
    const {id} = req.params;
    const application = await Application.findById(id);
    if(!application){
        return next(new ErrorHandler("APPLICATION NOT FOUND!",404));
    }
    await application.deleteOne();
    res.status(200).json({
        success:true,
        message:"APPLICATION DELETED SUCCESSFULLY!"
    });
});

export const postApplication = catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role === "EMPLOYER"){
        return next(new ErrorHandler("ONLY JOB SEEKER CAN ACCESS RESOURCES",400));
    }
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("PLEASE UPLOAD A RESUME",400));
    }
    const {resume} = req.files;
    const allowedFormat = ['image/jpeg','image/png','image/webp'];
    if(!allowedFormat.includes(resume.mimetype)){
        return next(new ErrorHandler("PLEASE UPLOAD A RESUME IN JPEG , PNG  OR WEBP FORMAT",400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath);
    console.log(cloudinaryResponse);
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("CloudinaryError : " ,cloudinaryResponse.error||"Unknown cloudinary error" );
        return next(new ErrorHandler("ERROR UPLOADING RESUME",500));
    }
    const {name,email,coverLetter,phone,address,jobId} = req.body;
    const applicantId = {
        user:req.user._id,
        role:"JOB SEEKER"
    };
    if(!jobId){
        return next(new ErrorHandler("JOB NOT FOUND!",404));
    }
    const jobDetails = await Job.findById(jobId);
    if(!jobDetails){
        return next(new ErrorHandler("JOB NOT FOUND!",404));
    }
    const employerId = {
        user:jobDetails.postedBy,
        role:"EMPLOYER"
    };
    if(!name || !email || !coverLetter || !phone || !address || !applicantId || !employerId || !resume){
        return next(new ErrorHandler("PLEASE FILL ALL FIELDS",400));
    }
    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantId,
        employerId,
        resume:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success:true,
        message:"APPLICATION SUBMITTED SUCCESSFULLY!",
        application
    });
});
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";

class ApplicationController {
  static empGetAllApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "JOB SEEKER") {
      return next(new ErrorHandler("ONLY EMPLOYER CAN ACCESS RESOURCES", 400));
    }
    const { _id } = req.user;
    const applications = await Application.find({
      "employerInfo.id": _id,
      "deletedBy.employer": false
    });
    res.status(200).json({
      success: true,
      applications,
    });
  });

  static jobGetAllApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "EMPLOYER") {
      return next(new ErrorHandler("ONLY JOB SEEKER CAN ACCESS RESOURCES", 400));
    }
    const { _id } = req.user;
    const applications = await Application.find({
      "jobSeekerInfo.id": _id,
      "deletedBy.jobSeeker": false,
    });
    res.status(200).json({
      success: true,
      applications,
    });
  });

  static jobDeleteApplication = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("APPLICATION NOT FOUND!", 404));
    }
    const { role } = req.user;
    switch (role) {
      case "JOB SEEKER":
        application.deletedBy.jobSeeker = true;
        await application.save();
        break;
      case "EMPLOYER":
        application.deletedBy.employer = true;
        await application.save();
        break;
      default:
        console.log("Default case for application delete function.");
        break;
    }
    if (application.deletedBy.employer === true && application.deletedBy.jobSeeker === true) {
      await application.deleteOne();
    }
    res.status(200).json({
      success: true,
      message: "APPLICATION DELETED SUCCESSFULLY!"
    });
  });

  static postApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "EMPLOYER") {
      return next(new ErrorHandler("ONLY JOB SEEKER CAN ACCESS RESOURCES", 400));
    }
    console.log("here it make error?");
    const { id } = req.params;
    const { name, email, phone, address, coverLetter } = req.body;
    if (!name || !email || !phone || !address || !coverLetter) {
      return next(new ErrorHandler("All fields are required.", 400));
    }
    const jobSeekerInfo = {
      id: req.user._id,
      name,
      email,
      phone,
      address,
      coverLetter,
      role: "JOB SEEKER",
    };
    const jobDetails = await Job.findById(id);
    if (!jobDetails) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    const isAlreadyApplied = await Application.findOne({
      "jobInfo.jobId": id,
      "jobSeekerInfo.id": req.user._id,
    });
    if (isAlreadyApplied) {
      return next(
        new ErrorHandler("You have already applied for this job.", 400)
      );
    }
    if (req.files && req.files.resume) {
      const { resume } = req.files;
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          resume.tempFilePath,
          {
            folder: "Job_Seekers_Resume",
          }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return next(
            new ErrorHandler("Failed to upload resume to cloudinary.", 500)
          );
        }
        jobSeekerInfo.resume = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        };
      } catch (error) {
        return next(new ErrorHandler("Failed to upload resume", 500));
      }
    } else {
      if (req.user && !req.user.resume.url) {
        return next(new ErrorHandler("Please upload your resume.", 400));
      }
      jobSeekerInfo.resume = {
        public_id: req.user && req.user.resume.public_id,
        url: req.user && req.user.resume.url,
      };
    }
    const employerInfo = {
      id: jobDetails.postedBy,
      role: "EMPLOYER",
    };
    const jobInfo = {
      jobId: id,
      jobTitle: jobDetails.title,
    };
    const application = await Application.create({
      jobSeekerInfo,
      employerInfo,
      jobInfo,
    });
    res.status(201).json({
      success: true,
      message: "Application submitted.",
      application,
    });
  });
}
export default ApplicationController;
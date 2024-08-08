import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

class JobController {
  static getAllJobs = catchAsyncError(async (req, res, next) => {
    const { city, niche, searchKeyword, expired } = req.query;
    const query = {};
    if (city) {
      query.location = { $regex: city, $options: "i" };
    }
    if (niche) {
      query.jobNiche = { $regex: niche, $options: "i" };
    }
    if (searchKeyword) {
      query.$or = [
        { title: { $regex: searchKeyword, $options: "i" } },
        { companyName: { $regex: searchKeyword, $options: "i" } },
        { introduction: { $regex: searchKeyword, $options: "i" } },
      ];
    }
    if (expired !== 'true') {
      query.expired = false;
    }
    const jobs = await Job.find(query);
    res.status(200).json({
      success: true,
      jobs,
      count: jobs.length,
    });
  });

  static postJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role !== "EMPLOYER") {
      return next(new ErrorHandler("ONLY EMPLOYER ARE ALLOWED TO POST JOBS!", 400));
    }
    const {
      title,
      jobType,
      location,
      companyName,
      introduction,
      responsibilities,
      qualifications,
      offers,
      salary,
      hiringMultipleCandidates,
      personalWebsiteTitle,
      personalWebsiteUrl,
      jobNiche,
    } = req.body;
    if (
      !title ||
      !jobType ||
      !location ||
      !companyName ||
      !introduction ||
      !responsibilities ||
      !qualifications ||
      !salary ||
      !jobNiche
    ) {
      return next(new ErrorHandler("Please provide full job details.", 400));
    }
    if (
      (personalWebsiteTitle && !personalWebsiteUrl) ||
      (!personalWebsiteTitle && personalWebsiteUrl)
    ) {
      return next(
        new ErrorHandler(
          "Provide both the website url and title, or leave both blank.",
          400
        )
      );
    }
    const postedBy = req.user._id;
    const job = await Job.create({
      title,
      jobType,
      location,
      companyName,
      introduction,
      responsibilities,
      qualifications,
      offers,
      salary,
      hiringMultipleCandidates,
      personalWebsite: {
        title: personalWebsiteTitle,
        url: personalWebsiteUrl,
      },
      jobNiche,
      postedBy,
    });
    res.status(201).json({
      success: true,
      message: "Job posted successfully.",
      job,
    });
  });

  static getMyJobs = catchAsyncError(async (req, res, next) => {
    // console.log("hii");
    const { role } = req.user;
    if (role !== "EMPLOYER") {
        return next(new ErrorHandler("ONLY EMPLOYER CAN ACCESS RESOURCES", 400));
    }
    const userId = req.user._id; // No need to destructure
    // console.log("User ID for Query:", userId); // Log the user ID used in query

    const myJobs = await Job.find({ postedBy: userId });
    res.status(200).json({
        success: true,
        message: "HERE ARE THE JOBS",
        myJobs
    });
});

  //no need to change
  static updateJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role !== "EMPLOYER") {
      return next(new ErrorHandler("ONLY EMPLOYER CAN ACCESS RESOURCES", 400));
    }
    const { jobId } = req.params;
    // console.log(jobId);
    let job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorHandler("JOB NOT FOUND", 404));
    }
    job = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });
    res.status(200).json({
      success: true,
      message: "JOB UPDATED SUCCESSFULLY",
      job
    });
  });
  //done update
  static deleteJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role !== "EMPLOYER") {
      return next(new ErrorHandler("ONLY EMPLOYER CAN ACCESS RESOURCES", 400));
    }
    const { jobId } = req.params;
    let job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorHandler("JOB NOT FOUND", 404));
    }
    job = await Job.findByIdAndDelete(jobId);
    res.status(200).json({
      success: true,
      message: "JOB DELETED SUCCESSFULLY",
    });
  });
  //done update
  static getJob = catchAsyncError(async (req, res, next) => {
    const { jobId } = req.params;
    // console.log(jobId);
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        return next(new ErrorHandler("JOB NOT FOUND", 404));
      }
      res.status(200).json({
        success: true,
        job,
      });
    }
    catch (err) {
      return next(new ErrorHandler(err.message, 404));
    }
  });
}
export default JobController;
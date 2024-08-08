import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
export const getUnexpiredJobsCount = async () => {
    return await Job.countDocuments({ expired: false });
  };
  
  export const getJobSeekersCount = async () => {
    return await User.countDocuments({ role: 'JOB SEEKER' });
  };
  
  export const getEmployersCount = async () => {
    return await User.countDocuments({ role: 'EMPLOYER' });
  };
  
  export const getCounts = async (req, res) => {
    try {
      const unexpiredJobsCount = await getUnexpiredJobsCount();
      const jobSeekersCount = await getJobSeekersCount();
      const employersCount = await getEmployersCount();
  
      res.status(200).json({
        unexpiredJobsCount,
        jobSeekersCount,
        employersCount,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching counts' });
    }
  };
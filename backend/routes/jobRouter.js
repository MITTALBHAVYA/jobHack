import express from "express";
import { getAllJobs,postJob,getMyJobs,updateJob,deleteJob,getJob} from "../controllers/jobController.js";
import { isAuthorized } from "../middlewares/auth.js";
const router = express.Router();

router
.get('/getAll',getAllJobs);

router
.post('/post',isAuthorized,postJob);

router
.get('/getMyJobs',isAuthorized,getMyJobs);

router
.put('/update/:jobId',isAuthorized,updateJob);

router
.delete('/delete/:jobId',isAuthorized,deleteJob);

router.get("/:jobId",isAuthorized,getJob)
export default router;
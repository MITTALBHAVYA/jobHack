import express from "express";
import { getAllJobs,postJob } from "../controllers/jobController.js";
import { isAuthorized } from "../middlewares/auth.js";
const router = express.Router();

router
.get('/getAllJobs',getAllJobs);

router
.post('/postJob',isAuthorized,postJob);
export default router;
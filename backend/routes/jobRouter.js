import express from "express";
import JobController from "../controllers/jobController.js";
import { isAuthorized } from "../middlewares/auth.js";
class JobRouter{
    constructor(){
        this.router = express.Router();
        this.setRoutes();
    }
    setRoutes(){
        this.router.post('/post',isAuthorized,JobController.postJob);
        this.router.get('/getAll',JobController.getAllJobs);
        this.router.get('/getMyJobs',isAuthorized,JobController.getMyJobs);
        this.router.get("/:jobId",isAuthorized,JobController.getJob);
        this.router.put('/update/:jobId',isAuthorized,JobController.updateJob);
        this.router.delete('/delete/:jobId',isAuthorized,JobController.deleteJob);
    }
    getRouter(){
        return this.router;
    }
}

export default new JobRouter().getRouter();
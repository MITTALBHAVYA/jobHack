import express from "express";
import ApplicationController from "../controllers/applicationController.js";
import { isAuthorized } from "../middlewares/auth.js";
class ApplicationRouter{
    constructor(){
        this.router = express.Router();
        this.setRoutes();
    }
    setRoutes(){
        this.router.get("/employer/getAll",isAuthorized,ApplicationController.empGetAllApplications); 
        this.router.get("/jobseeker/getAll",isAuthorized,ApplicationController.jobGetAllApplications);
        this.router.post("/post/:id",isAuthorized,ApplicationController.postApplication);
        this.router.delete("/delete/:id",isAuthorized,ApplicationController.jobDeleteApplication);
    }
    getRouter(){
        return this.router;
    }
}
export default new ApplicationRouter().getRouter();
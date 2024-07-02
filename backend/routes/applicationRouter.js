import express from "express";
import { empGetAllApplications,jobGetAllApplications,jobDeleteApplication,postApplication } from "../controllers/applicationController.js";
import { isAuthorized } from "../middlewares/auth.js";
const router = express.Router();

router.post("/post",isAuthorized,postApplication);
router.get("/employer/getAll",isAuthorized,empGetAllApplications);
router.get("/jobseeker/getAll",isAuthorized,jobGetAllApplications);
router.delete("/delete/:id",isAuthorized,jobDeleteApplication);
export default router;
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import statsRouter from "./routes/statsRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import { newsLetterCron } from "./automation/newsLetterCron.js";

class App {
  constructor() {
    this.app = express();
    this.configureEnvironment();
    this.setMiddlewares();
    this.setRoutes();
    this.setDatabase();
    this.setCronJobs();
    this.setErrorHandling();
  }

  configureEnvironment() {
    dotenv.config({ path: './config/config.env' });
  }

  setMiddlewares() {
    this.app.use(
      cors({
        origin: ["https://jobhack108.netlify.app", "http://localhost:5173"],
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        credentials: true,
      })
    );
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
      })
    );
  }

  setRoutes() {
    this.app.use("/api/v1/user", userRouter);
    this.app.use("/api/v1/application", applicationRouter);
    this.app.use("/api/v1/job", jobRouter);
    this.app.use("/api/v1/stats", statsRouter);
  }

  setDatabase() {
    dbConnection();
  }

  setCronJobs() {
    newsLetterCron();
  }

  setErrorHandling() {
    this.app.use(errorMiddleware);
  }

  getApp() {
    return this.app;
  }
}

export default new App().getApp();

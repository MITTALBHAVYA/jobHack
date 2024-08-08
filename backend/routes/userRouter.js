import express from "express";
import UserController from "../controllers/userController.js";
import { isAuthorized } from "../middlewares/auth.js";

class UserRouter {
    constructor() {
        this.router = express.Router();
        this.setRoutes();
    }

    setRoutes() {
        this.router.post('/register', UserController.register);
        this.router.post('/login', UserController.login);
        this.router.get('/logout', isAuthorized, UserController.logout);
        this.router.get("/getUser", isAuthorized, UserController.getUser);
        this.router.put("/update/profile", isAuthorized, UserController.updateProfile);
        this.router.put("/update/password", isAuthorized, UserController.updatePassword);
        this.router.delete("/delete/profile", isAuthorized, UserController.deleteUser);
    }

    getRouter() {
        return this.router;
    }
}

export default new UserRouter().getRouter();

import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from './error.js';
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
export const isAuthorized = catchAsyncError(async(req,res,next)=>{
    // console.log("check auth...")
    // console.log(req.cookies.token," ",req.headers.authorization)
    const token = 
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    // console.log(token || "No token");
    if(!token){
        return next(new ErrorHandler("USER NOT AUTHORIZED",401));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);
    // console.log(req.user);
    next();
});
import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
export const register = catchAsyncError(async(req,res,next)=>{
    const {userName,email,phone,role,password,confirmPassword}=req.body;
    if(!userName||!email||!phone||!role||!password||!confirmPassword){
        return next(new ErrorHandler("Please fill the registration form!!"));
    }
    const isEmail = await User.findOne({email});
    if(isEmail){
        return next(new ErrorHandler("Email already exists!"));
    }
    const user = await User.create({
        userName,
        email,
        phone,
        role,
        password,
        confirmPassword
    });
    res.status(200).json({
        success:true,
        message:"USER registered",
        user
    });
});
import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import {sendToken} from "../utils/jwtToken.js";

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
    sendToken(user,201,res,"USER REGISTERED SUCCESSFULLY");
});

export const login = catchAsyncError(async(req,res,next)=>{
    const {email,password,role} = req.body;
    if(!email || !password || !role){
        return next(new ErrorHandler(`PLEASE PROVIDE THE EMAIL,PASSWORD,ROLE`,400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler(`INVALID EMAIL OR PASSWORD`,400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('INVALID PASSWORD',400));
    }
    if(user.role!==role){
        return next(new ErrorHandler('USER WITH ROLE NOT FOUND',400));
    }
    sendToken(user,201,res,"USER LOGIN SUCCESSFULLY!");
});

export const logout = catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie("token","",{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    .json({
        success:true,
        message:"USER LOGGED OUT SUCCESSFULLY!!",
    });
});

export const getUser = catchAsyncError((req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        user,
    });
});
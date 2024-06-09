import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : [true,"pleaase provide your name"],
        minLength:[3,"NAME MUST CONTAIN ATLEAST 3 CHARACTER"],
        maxLength:[30,"NAME MUST NOT EXCEED 30 characters"],
    },
    email:{
        type:String,
        required:[true,"Please provide your email"],
        validate:[validator.isEmail,"please provide a valid email"],
    },
    phone:{
        type:Number,
        required:[true,"Please provide your phone number."]
    },
    password:{
        type:String,
        required:[true,"Please provide password"],
        minLength:[3,"Password MUST CONTAIN ATLEAST 8 CHARACTER"],
        maxLength:[30,"Password MUST NOT EXCEED 32 characters"],
        select : false
    },
    confirmPassword:{
        type:String,
        required:true,
        minLength:8,
        validate : function(){
            return this.confirmPassword==this.password;
        }
    },
    role:{
        type:String,
        required:[true,"PLEASE PROVIDE YOUR ROLE"],
        enum:["JOB SEEKER","EMPLOYEER"],
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});
//Confirm password check
userSchema.pre('save',function(){
    this.confirmPassword=undefined;
})
//HASING THE PASSWORD
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,10);
})
//COMPARING PASSWORD
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};
//GENERATING A JWT TOKEN FOR AUTHORIZATION

userSchema.methods.getJWTToken=function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    })
};

export const User = mongoose.model("USER",userSchema);
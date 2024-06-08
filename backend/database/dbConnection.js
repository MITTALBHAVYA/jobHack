import mongoose from "mongoose";

export const dbConnection =()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"MERN_STACK_JOB_SEEKING"
    }).then(()=>{
        console.log("Connected database");
    }).catch((err)=>{
        console.log(`Some err occured while connecting database ${err}`);
    })
}
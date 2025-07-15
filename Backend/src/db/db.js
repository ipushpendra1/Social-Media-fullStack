import mongoose from "mongoose";
import config from "../config/config.js";


function connectDB(){
        mongoose.connect()
        .then(()=>{
            console.log(config.MONGODB_URL);
            
        }).catch((err)=>{
          console.log("mongoDB connection Error ", err);
          
        })
}

export default connectDB
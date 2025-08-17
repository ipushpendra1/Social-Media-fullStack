import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    message:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    }
})

const messageModel = mongoose.model("message",messageSchema);
export default messageModel;   
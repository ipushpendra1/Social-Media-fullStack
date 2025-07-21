import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    mentions:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'

    }
]
})

const Post = mongoose.model('posts',postSchema)
export default Post;


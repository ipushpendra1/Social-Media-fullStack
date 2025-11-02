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
        ref:'user'
    },
    mentions:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'

    }
]
})

const Post = mongoose.model('posts',postSchema)
export default Post;


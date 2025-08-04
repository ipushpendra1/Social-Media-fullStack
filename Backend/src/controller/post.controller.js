import { uploadFile } from "../services/storage.service.js"
import {generateCaption} from "../services/ai.service.js"
import {v4 as uuidv4 } from "uuid"
import { createPost, getPosts } from "../dao/post.dao.js"
import { createComment } from "../dao/comment.dao.js"

/* image , mentions? */

export async function createPostController(req,res){
    const{mentions} = req.body

    const [file,caption]= await Promise.all([
        uploadFile(req.file,uuidv4()), // 4s
        generateCaption(req.file) // 10s
    ])

    const post = await createPost({
        mentions,
        url:file.url,
        caption,
        user:req.user._id
    })

    res.status(201).json({
        message:"Post created successfully",
        post
    })
    
}





export async function getPostController(req,res){  
    const posts = await getPosts(req.query.skip, Math.min(req.query.limit,20))  
    res.status(200).json({
        message:"Posts fetched successfully",
        posts
    })
}






export async function createCommentController(req,res){
    const {post,text} = req.body
    const user = req.user

    const comment = await createComment({
        user:user._id,
        post,
        text
    })

    res.status(201).json({
        message:"Comment created successfully",
        comment
    })
}
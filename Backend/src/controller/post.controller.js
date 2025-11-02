import { uploadFile } from "../services/storage.service.js"
import {generateCaption} from "../services/ai.service.js"
import {v4 as uuidv4 } from "uuid"
import { createPost, getPosts } from "../dao/post.dao.js"
import { createComment } from "../dao/comment.dao.js"
import { createLike, isLikeExists, deleteLike } from "../dao/like.dao.js"

/* image , mentions? */

export async function createPostController(req,res){
    // Validate user authentication
    if (!req.user || !req.user._id) {
        return res.status(401).json({
            message: "Unauthorized: User not authenticated"
        })
    }

    let{mentions} = req.body

    // Parse mentions if it's a JSON string (from FormData)
    if (typeof mentions === 'string') {
        try {
            mentions = JSON.parse(mentions)
        } catch (e) {
            // If parsing fails, treat as empty array
            mentions = []
        }
    }
    
    // Ensure mentions is an array or undefined
    if (!mentions || !Array.isArray(mentions)) {
        mentions = []
    }

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
    const skip = parseInt(req.query.skip) || 0
    const limit = Math.min(parseInt(req.query.limit) || 10, 20)
    const posts = await getPosts(skip, limit)  
    res.status(200).json({
        message:"Posts fetched successfully",
        posts
    })
}






export async function createCommentController(req,res){
    // Validate user authentication
    if (!req.user || !req.user._id) {
        return res.status(401).json({
            message: "Unauthorized: User not authenticated"
        })
    }

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





export async function createLikeController(req,res){
    // Validate user authentication
    if (!req.user || !req.user._id) {
        return res.status(401).json({
            message: "Unauthorized: User not authenticated"
        })
    }

    const { post } = req.body
    const user = req.user

    const isLikeAlreadyExists = await isLikeExists({ user: user._id, post })

    if (isLikeAlreadyExists) {

        await deleteLike({ user: user._id, post })

        return res.status(200).json({
            message: "Like removed successfully"
        })
    }

    const like = await createLike({ user: user._id, post })

    res.status(201).json({
        message: "Post liked successfully",
        like
    })
}
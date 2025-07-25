import { uploadFile } from "../services/storage.service.js"
import {generateCaption} from "../services/ai.service.js"
import {v4 as uuidv4 } from "uuid"
import { createPost } from "../dao/post.dao.js"
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
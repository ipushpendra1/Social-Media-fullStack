import Post from "../models/post.model.js";
import {v4 as uuidv4} from "uuid";
import { uploadFile, } from "../services/storage.service.js";
import { generateCaption } from "../services/ai.service.js";




const createPost = async(req, res)=>{
    
    const {file, caption} = await Promise.all([
        uploadFile(file, uuidv4(), file.originalname),
        generateCaption(file)
    ])




const finalCaption = body.caption || caption;

const post = new Post({
    caption: finalCaption,
    mentions,
  });


}

export { createPost };











  
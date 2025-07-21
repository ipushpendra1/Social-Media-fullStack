import Post from "../models/post.model.js";
import {v4 as uuidv4} from "uuid";
import { uploadFile, } from "../services/storage.service.js";
import { generateCaption } from "../services/ai.service.js";




const createPost = async(req, res)=>{
    const{mentions} = req.body;
    
    const {file, caption} = await Promise.all([
        uploadFile(req.file, uuidv4()),
        generateCaption(req.file)
    ])

  console.log(req.user);
  

}

export { createPost };











  
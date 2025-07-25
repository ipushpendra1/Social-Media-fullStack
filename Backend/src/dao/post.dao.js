import postModel from "../models/post.model.js"

export async function createPost(data) {

    const {mentions,url,caption,user} = data;

    return await postModel.create({
        image: url,
        caption,
        user,
        mentions

    })

    
}
import postModel from "../models/post.model.js"
import likeModel from "../models/like.model.js"
import commentModel from "../models/comment.model.js"

export async function createPost(data) {

    const {mentions,url,caption,user} = data;

    return await postModel.create({
        image: url,
        caption,
        user,
        mentions

    })

    
}







export async function getPosts(skip=0,limit=10){
    const posts = await postModel.find()
    .sort({createdAt:-1})
    .skip(skip)
    .limit(limit)
    .populate("user", "username image")
    .populate("mentions", "username image")
    .lean() // Convert to plain JS objects for better performance

    // Get likes count and comments for each post
    const postsWithCounts = await Promise.all(
        posts.map(async (post) => {
            const likesCount = await likeModel.countDocuments({ post: post._id })
            const comments = await commentModel.find({ post: post._id })
                .populate("user", "username")
                .sort({ createdAt: -1 })
                .limit(10)
                .lean()
            
            return {
                ...post,
                likesCount,
                comments: comments.map(comment => ({
                    _id: comment._id,
                    user: comment.user?.username || 'Unknown',
                    text: comment.text
                }))
            }
        })
    )

    return postsWithCounts;
}
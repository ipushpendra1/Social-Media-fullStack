import express from "express";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import postRoutes from "./routes/post.routes.js"


const app = express();
app.use(express.json())
app.use(cookieParser())




app.get("/", (req, res) => {
    res.send("Welcome to the API")
})
app.use('/auth',authRoutes)
app.use('/posts',postRoutes)




export default app
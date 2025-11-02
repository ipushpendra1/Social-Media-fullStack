import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import postRoutes from "./routes/post.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import profileRoutes from "./routes/profile.routes.js"


const app = express();

// CORS configuration - allow frontend to send credentials (cookies)
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(cookieParser())




app.get("/", (req, res) => {
    res.send("Welcome to the API")
})
app.use('/auth',authRoutes)
app.use('/posts',postRoutes)
app.use('/chat',chatRoutes)
app.use('/profile',profileRoutes)





export default app
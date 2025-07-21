import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createPost } from "../controller/post.controller.js";
import multer from "multer";


const upload = multer({storage:multer.memoryStorage()});

const router = express.Router();


router.post('/posts',authMiddleware, upload.single("image"), createPost)

export default router;
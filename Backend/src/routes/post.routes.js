import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createPostController, getPostController, createCommentController } from "../controller/post.controller.js";
import multer from "multer";
import { getPostValidator, createCommentValidator } from "../middlewares/Validator.middleware.js";


const upload = multer({storage:multer.memoryStorage()});

const router = express.Router();


router.post('/',authMiddleware, upload.single("image"), createPostController)
router.get('/',authMiddleware, getPostValidator, getPostController)

router.post('/comment',authMiddleware, createCommentValidator, createCommentController)

export default router;
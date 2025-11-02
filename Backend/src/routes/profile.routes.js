import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getProfileController, updateProfileController } from "../controller/profile.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Get current user's profile
router.get('/', authMiddleware, getProfileController);

// Update current user's profile
// Image is optional, so we use upload.single but don't require it
router.put('/', authMiddleware, upload.single("image"), updateProfileController);

export default router;


import express from "express";
import { registerController, loginController, logoutController } from "../controller/auth.controller.js";
import { registerValidator } from "../middlewares/Validator.middleware.js";

const router = express.Router();




router.post('/register', registerValidator, registerController)
router.post('/login',loginController)
router.post('/logout', logoutController)




export default router;
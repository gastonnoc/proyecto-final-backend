import express from "express";
import { loginController, registerController, resetPasswordController, rewritePasswordController, verifyEmailController } from "../controllers/auth.controller.js";


const authRouter = express.Router();

authRouter.post("/register", registerController)
authRouter.get('/verify-email', verifyEmailController)
authRouter.post('/login', loginController)
authRouter.put('/reset-password', resetPasswordController)
authRouter.post('/rewrite-password', rewritePasswordController)
export default authRouter
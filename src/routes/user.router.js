import express from 'express';
import { updateProfileImage } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.patch('/profile-image', authMiddleware, updateProfileImage);

export default userRouter;
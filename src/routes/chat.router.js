import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createChatController, getMessagesListFromChatController, sendMessageToChatController } from "../controllers/chat.controller.js";

const chatRouter = Router()

chatRouter.post('/:chat_id', authMiddleware, createChatController)

chatRouter.post('/:chat_id/messages', authMiddleware, sendMessageToChatController)

chatRouter.get('/:chat_id/messages', authMiddleware, getMessagesListFromChatController)

export default chatRouter
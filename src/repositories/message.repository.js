import Message from "../models/Message.model.js";
import { ServerError } from "../utils/errors.utils.js";
import chatRepository from "./chat.repository.js";

class MessageRepository {
    
    async create({sender_id, chat_id, content}){
        const chat_found = await chatRepository.findChatById(chat_id)
        if(!chat_found){
            throw new ServerError('Chat not found', 404)
        }   

        const new_message = await Message.create({
            sender: sender_id,
            chat: chat_id, 
            content
        })
        return new_message
    }
    async findMessagesFromChat ({chat_id, user_id}){
        const chat_found = await chatRepository.findChatById(chat_id)
        
        if(!chat_found){
            throw new ServerError('Chat not found', 404)
        }   

        const messages_list = await Message.find({char: char_id}).populate('sender', 'username email')
        return messages_list
    }
}
const messageRepository = new MessageRepository()

export default messageRepository
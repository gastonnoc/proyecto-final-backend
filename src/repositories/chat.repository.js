
import Chat from "../models/Chat.model.js";

class ChatRepository {
    async findChannelById (chat_id){
        return Chat.findById(chat_id).populate('chat')
    }
    async createChat({ name, user_id }) {

        const chat = await Chat.create(
            {
                name,
                chat: chat_id,
                created_by: user_id
            }
        )
        return chat

    }
    
}

const chatRepository = new ChatRepository()

export default chatRepository
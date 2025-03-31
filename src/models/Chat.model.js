import mongoose from "mongoose";

const chat_schema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        chat: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat'},
        created_at: {type: Date, default: Date.now},
        created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }
)

const Chat = mongoose.model('Chat', chat_schema)

export default Chat
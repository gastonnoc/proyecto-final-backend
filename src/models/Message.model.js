import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Chat'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date, default: Date.now
    }
})

const Message = mongoose.model('Message', messageSchema)
export default Message
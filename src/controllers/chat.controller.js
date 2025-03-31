import chatRepository from "../repositories/chat.repository.js"
import messageRepository from "../repositories/message.repository.js"
import { AUTHORIZATION_TOKEN_PROPS } from "../utils/constants/token.constants.js"



export const createChatController =async (req, res) =>{
    try{

        const {name} = req.body

        const user_id = req.user[AUTHORIZATION_TOKEN_PROPS.ID]

        const new_chat = await chatRepository.createChat({name, user_id, chat_id})
        res.json({
            ok: true,
            status: 200,
            message: "Chat created",
            data: {
                new_chat
            }
        })
    }
    catch(error){
        console.log("Error al crear chat", error);

        if (error.status) {
            return res.status(400).send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }

        res.status(500).send({
            status: 500,
            ok: false,
            message: "Internal server error"
        });
    }
}

export const sendMessageToChatController = async (req, res) =>{
    try{
        const {chat_id} = req.params
        const user_id = req.user[AUTHORIZATION_TOKEN_PROPS.ID]
        const {content} = req.body


        const new_message = await messageRepository.create({sender_id: user_id, chat_id, content})
        res.json({
            ok: true,
            message: 'Message created',
            status: 201,
            data: {
                new_message
            }
        })
    }
    catch(error){
        console.log("Error al enviar mensaje al chat", error);

        if (error.status) {
            return res.status(400).send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }

        res.status(500).send({
            status: 500,
            ok: false,
            message: "Internal server error"
        });
    }
}

export const getMessagesListFromChatController = async (req, res) =>{
    try{
        const user_id = req.user[AUTHORIZATION_TOKEN_PROPS.ID]
        const {chat_id} = req.params
        const messages = await messageRepository.findMessagesFromChat({chat_id, user_id})
        res.json({
            ok: true,
            message: 'Messages found',
            status: 200,
            data: {
                messages
            }
        })

    }
    catch(error){
        console.log("Error al obtener la lista de mensajes", error);

        if (error.status) {
            return res.status(400).send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }

        res.status(500).send({
            status: 500,
            ok: false,
            message: "Internal server error"
        });
    }
} 
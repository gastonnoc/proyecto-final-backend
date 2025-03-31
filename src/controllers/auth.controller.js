import { ServerError } from "../utils/errors.utils.js";
import UserRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import ENVIRONMENT from "../config/environment.config.js";
import { sendMail } from "../utils/mailer.utils.js";
import { AUTHORIZATION_TOKEN_PROPS } from "../utils/constants/token.constants.js";

export const registerController = async (req, res) => {
    try {
        const { 
            username, 
            email, 
            password,
            profile_image_base64
        } = req.body;

        if (!username) {
            throw new ServerError("Username is required", 400);
        }
        if (!email) {
            throw new ServerError("Email is required", 400);
        }
        if (!password) {
            throw new ServerError("Password is required", 400);
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const verification_token = jwt.sign(
            { email }, 
            ENVIRONMENT.SECRET_KEY_JWT, 
            { expiresIn: '24h' } 
        )

        await UserRepository.create({ username, email, password: passwordHash, verification_token, profile_image_base64 })

        await sendMail({
            to: email,
            subject: 'Valida tu email',
            html: `
            <h1>Valida tu email para usar WhatsApp</h1>
            <p>
            Esta validacion es para asegurarnos que tu email es realmente tuyo, si no te has registrado en WhatsApp entonces ignora este email.
            </p>
            <a href='${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email?verification_token=${verification_token}'>
                Verificar cuenta
            </a>
            `
        })
        return res.status(201).send(
            {
                message: "User created",
                status: 201,
                ok: true
            }
        );
    } catch (error) {
        console.log("Error al registrar", error);

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
};


export const verifyEmailController = async (req, res) => {
    try {
        const {verification_token} = req.query
        const payload = jwt.verify(verification_token, ENVIRONMENT.SECRET_KEY_JWT)
        const {email} = payload
        const user_found = await UserRepository.verifyUserByEmail(email)
        res.redirect(ENVIRONMENT.URL_FRONTEND + '/login')
    } catch (error) {
        console.log("Error al registrar", error);

        if (error.status) {
            return res.send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }

        res.send({
            status: 500,
            ok: false,
            message: "Internal server error"
        });
    }
}


export const loginController = async (req, res) => {
    try{    
        
        const {email, password} = req.body
        const user_found = await UserRepository.findUserByEmail(email)

        if(!user_found){
            throw new ServerError('User not found', 404)
        }
        if(!user_found.verified){
            throw new ServerError('User found has no validated his email', 400)
        }
        const isSamePassword = await bcrypt.compare(password, user_found.password)
        if(!isSamePassword){
            throw new ServerError('The password is not correct', 400)
        }
        
        const authorization_token = jwt.sign(
            {
                [AUTHORIZATION_TOKEN_PROPS.ID]: user_found._id,
                username: user_found.username,
                email: user_found.email
            },
            ENVIRONMENT.SECRET_KEY_JWT,
            {expiresIn: '2h'}
        )
        return res.json({
            ok: true,
            status: 200,
            message: 'Logged',
            data: {
                authorization_token,
                user: {
                    username: user_found.username,
                    email: user_found.email,
                    profile_image_base64: user_found.profile_image_base64
                }
            }
        })
    } catch (error) {
        console.log("Login error", error);

        if (error.status) {
            return res.send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }

        res.send({
            status: 500,
            ok: false,
            message: "Internal server error"
        });
    }
}

export const resetPasswordController = async (req, res) =>{
    try{
        const {email} = req.body
        const user_found = await UserRepository.findUserByEmail(email)
        if(!user_found){
            throw new ServerError("User not found", 404)
        }
        if(!user_found.verified){
            throw new ServerError("User email is not validated yet", 400)
        }

        const reset_token = jwt.sign({email, _id: user_found._id}, ENVIRONMENT.SECRET_KEY_JWT, {expiresIn: '2h'})
        await sendMail({
            to: email, 
            subject: "Reset your password",
            html: `
            <h1>Has solicitado resetar tu contraseña, de no ser asi ignora este email</h1>
            <a href='${ENVIRONMENT.URL_FRONTEND}/rewrite-password?reset_token=${reset_token}'>Click aqui para resetear tu contraseña</a>
            `
        })
        res.json(
            {
                ok: true,
                status: 200,
                message: 'Reset mail sent'
            }
        )
    }
    catch (error) {
        console.log("Error al registrar", error);

        if (error.status) {
            return res.send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }

        res.send({
            status: 500,
            ok: false,
            message: "Internal server error"
        });
    }
}

export const rewritePasswordController = async (req, res) => {
    try {
        const { newPassword, reset_token } = req.body
        const { _id } = jwt.verify(reset_token, ENVIRONMENT.SECRET_KEY_JWT)

        const newHashedPassword = await bcrypt.hash(newPassword, 10)
        await UserRepository.changeUserPassword(_id, newHashedPassword)

        
        return res.json({
            ok: true,
            message: 'Password changed succesfully',
            status: 200
        })


    } catch (err) {
        console.log(err);
        if (err.status) {
            return res.send({
                ok: false,
                status: err.status,
                message: err.message
            })
        }
        return res.send({
            message: "Internal server error",
            status: 500,
            ok: true
        })
    }
}
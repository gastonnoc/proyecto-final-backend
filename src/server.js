import ENVIRONMENT from "./config/environment.config.js";
import express from 'express';
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import mongoose from "./config/mongoDB.config.js";
import { sendMail } from "./utils/mailer.utils.js";
import cors from 'cors';
import { authMiddleware } from "./middlewares/authMiddleware.js"; 
import chatRouter from "./routes/chat.router.js";
import fs from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url'; 

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Usar carpeta temporal en Vercel
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); 
}

app.patch('/api/user/profile-image', authMiddleware, (req, res) => {
    try {
        const { file } = req.body; 
        const { user } = req;

        if (!file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const base64Data = file.replace(/^data:image\/png;base64,/, ''); 
        const filename = `${user._id}-profile.png`; 
        const filePath = path.join(uploadDir, filename);

        fs.writeFile(filePath, base64Data, 'base64', (err) => {
            if (err) {
                console.error("Error al guardar la imagen:", err);
                return res.status(500).json({ message: 'Error al guardar la imagen' });
            }

            return res.status(200).json({
                message: 'Imagen de perfil actualizada con éxito',
                imageUrl: `https://${req.headers.host}/tmp/uploads/${filename}`,
            });
        });
    } catch (error) {
        console.error("Error al actualizar la imagen de perfil:", error);
        return res.status(500).json({ message: 'Error al actualizar la imagen' });
    }
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);

app.listen(ENVIRONMENT.PORT, () => {
    console.log(`El servidor se está ejecutando en http://localhost:${ENVIRONMENT.PORT}`);
});

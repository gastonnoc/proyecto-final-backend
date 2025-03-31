import User from '../models/User.model.js'; 
import { ServerError } from "../utils/errors.utils.js"; 

export const updateProfileImage = async (req, res) => {
    try {
        const { userId } = req.user; 
        const { profile_image_base64 } = req.body; 

        if (!profile_image_base64) {
            throw new ServerError('No se ha proporcionado una imagen de perfil', 400);
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new ServerError('Usuario no encontrado', 404);
        }

        user.profile_image_base64 = profile_image_base64; 
        user.modified_at = Date.now(); 

        await user.save();

        return res.json({
            message: 'Imagen de perfil actualizada',
            user,
            ok: true
        });
    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).json({
            message: error.message || 'Error interno del servidor',
            ok: false
        });
    }
};

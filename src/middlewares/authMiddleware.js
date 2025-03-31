import ENVIRONMENT from "../config/environment.config.js";
import { ServerError } from "../utils/errors.utils.js";
import jwt from 'jsonwebtoken';
export const authMiddleware = (request, response, next) => {
    try {
      const authorization_header = request.headers['authorization'];
  
      if (!authorization_header) {
        throw new ServerError('No has proporcionado un header de autorización', 401);
      }
  
      const authorization_token = authorization_header.split(' ')[1];
      if (!authorization_token) {
        throw new ServerError('No has proporcionado un token de autorización', 401);
      }
  
      console.log('Token recibido:', authorization_token); 
  
      try {
        const user_info = jwt.verify(authorization_token, ENVIRONMENT.SECRET_KEY_JWT);
        request.user = user_info;
        next();
      } catch (error) {
        console.log('Error al verificar el token:', error);
        throw new ServerError('Token inválido o vencido', 400);
      }
    } catch (error) {
      console.log('Error al autenticar:', error.message);
  
      if (error.status) {
        return response.json({
          ok: false,
          status: error.status,
          message: error.message,
        });
      }
  
      response.json({
        status: 500,
        ok: false,
        message: 'Internal server error',
      });
    }
  };
  
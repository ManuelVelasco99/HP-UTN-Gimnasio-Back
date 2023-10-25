import { AuthController } from './AuthController';
import { Middlewares    } from '../../middlewares/verifyToken';
import { Router         } from 'express';

export const authRouter = Router();

authRouter.post('/login', AuthController.login);

authRouter.get('/mis-datos', Middlewares.verifyToken, AuthController.obtenerMisDatos);


import { Router          } from 'express';
import { SocioController } from './socioController';

export const socioRouter = Router();

socioRouter.get(
    '/listar',
    SocioController.listar
);


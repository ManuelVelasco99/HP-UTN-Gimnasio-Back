import { Router          } from 'express';
import { SocioController } from './socioController';

export const socioRouter = Router();

socioRouter.get(
    '/listar',
    SocioController.listar
);

socioRouter.post(
    '/agregar',
    SocioController.agregar
);

socioRouter.post(
    '/actualizar',
    SocioController.actualizar
);
socioRouter.get(
    '/:id/obtener',
    SocioController.obtener
);
socioRouter.get(
    '/:id/eliminar',
    SocioController.eliminar
);

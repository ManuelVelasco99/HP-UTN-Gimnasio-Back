import { Router          } from 'express';
import { ProfesorController } from './profesorController';

export const profesorRouter = Router();

profesorRouter.get(
    '/listar',
    ProfesorController.listar
);

profesorRouter.post(
    '/agregar',
    ProfesorController.agregar
);
profesorRouter.post(
    '/actualizar',
    ProfesorController.actualizar
);
profesorRouter.get(
    '/:id/obtener',
    ProfesorController.obtener
);
profesorRouter.get(
    '/:id/eliminar',
    ProfesorController.eliminar
);



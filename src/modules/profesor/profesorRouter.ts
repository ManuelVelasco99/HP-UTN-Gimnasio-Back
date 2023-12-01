import { Middlewares        } from '../../middlewares/verifyToken';
import { ProfesorController } from './profesorController';
import { Router             } from 'express';

export const profesorRouter = Router();

profesorRouter.get(
    '/listar',
    Middlewares.validarRolDelProfesorOEncargado,
    ProfesorController.listar
);

profesorRouter.post(
    '/agregar',
    Middlewares.validarRolDelEncargado,
    ProfesorController.agregar
);
profesorRouter.post(
    '/actualizar',
    Middlewares.validarRolDelEncargado,
    ProfesorController.actualizar
);
profesorRouter.get(
    '/:id/obtener',
    Middlewares.validarRolDelProfesorOEncargado,
    ProfesorController.obtener
);
profesorRouter.get(
    '/:id/eliminar',
    Middlewares.validarRolDelEncargado,
    ProfesorController.eliminar
);
profesorRouter.post(
    '/:dni/validar-profesor-dado-de-baja',
    Middlewares.validarRolDelEncargado,
    ProfesorController.validarProfesorDadoDeBaja,
);




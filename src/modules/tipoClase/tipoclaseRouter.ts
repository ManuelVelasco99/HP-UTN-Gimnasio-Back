import { Middlewares         } from '../../middlewares/verifyToken';
import { Router              } from 'express';
import { TipoClaseController } from './TipoClaseController';

export const tipoclaseRouter = Router();


tipoclaseRouter.get(
    '/listar',
    Middlewares.validarRolDelProfesorOEncargado,
    TipoClaseController.listar
);

tipoclaseRouter.post(
    '/agregar',
    Middlewares.validarRolDelEncargado,
    TipoClaseController.agregar
);

tipoclaseRouter.post(
    '/reporte',
    Middlewares.validarRolDelEncargado,
    TipoClaseController.reporte
);

tipoclaseRouter.get(
    '/:id/obtener', 
    Middlewares.validarRolDelProfesorOEncargado,
    TipoClaseController.obtener
);

tipoclaseRouter.post(
    '/:id/editar',
    Middlewares.validarRolDelEncargado,
    TipoClaseController.editar
);
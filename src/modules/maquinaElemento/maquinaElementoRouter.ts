import { MaquinaElementoController } from './MaquinaElementoController';
import { Middlewares               } from '../../middlewares/verifyToken';
import { Router                    } from 'express';

export const maquinaElementoRouter = Router();

maquinaElementoRouter.get(
    '/listar', 
    Middlewares.validarRolDelEncargado, 
    MaquinaElementoController.listar
);

maquinaElementoRouter.post(
    '/agregar', 
    MaquinaElementoController.agregar
);

maquinaElementoRouter.get(
    '/:id/obtener', 
    MaquinaElementoController.obtener
);

maquinaElementoRouter.post(
    '/:id/editar',
    MaquinaElementoController.editar
);

maquinaElementoRouter.get(
    '/:id/eliminar',
    MaquinaElementoController.eliminar
);
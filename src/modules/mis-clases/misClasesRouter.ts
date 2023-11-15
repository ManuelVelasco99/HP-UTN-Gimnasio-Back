import { MisClasesController } from './MisClasesController';
import { Router              } from 'express';
export const misClasesRouter = Router();

misClasesRouter.get(
    '/listar',
    MisClasesController.listar
);

misClasesRouter.post(
    '/:idClase/inscribirse',
    MisClasesController.inscribirse
);

misClasesRouter.post(
    '/:idClase/cancelar-inscripcion',
    MisClasesController.cancelarInscripcion
);
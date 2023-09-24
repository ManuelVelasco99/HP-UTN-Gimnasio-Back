import { Router                  } from 'express';
import { TipoEjercicioController } from './tipoEjercicioController';

export const tipoEjercicioRouter = Router();

tipoEjercicioRouter.get('/', (req, res) => {
    res.json({
        data : "TipoEjercicio route"
    });
});

tipoEjercicioRouter.get('/listar', (req, res) => {
    TipoEjercicioController.listar(req, res);
});

tipoEjercicioRouter.post('/agregar', (req, res) => {
    TipoEjercicioController.agregar(req, res);
});

tipoEjercicioRouter.put('/actualizar', (req, res) => {
    TipoEjercicioController.actualizar(req, res);
});
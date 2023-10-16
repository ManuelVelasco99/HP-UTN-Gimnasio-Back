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

tipoEjercicioRouter.post('/:id/editar', (req, res) => {
    TipoEjercicioController.editar(req, res);
});

tipoEjercicioRouter.get('/:id/obtener', (req, res) => {
    TipoEjercicioController.obtener(req, res);
});
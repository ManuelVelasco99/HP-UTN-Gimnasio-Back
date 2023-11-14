import { Router                  } from 'express';
import { ClaseController } from './claseController';

export const claseRouter = Router();

claseRouter.get('/', (req, res) => {
    res.json({
        data : "Clase route"
    });
});

claseRouter.get('/listar', (req, res) => {
    ClaseController.listar(req, res);
});

claseRouter.post('/agregar', (req, res) => {
    ClaseController.agregar(req, res);
});

claseRouter.post('/:id/editar', (req, res) => {
    ClaseController.actualizar(req, res);
});

claseRouter.get('/:id/obtener', (req, res) => {
    ClaseController.obtener(req, res);
});
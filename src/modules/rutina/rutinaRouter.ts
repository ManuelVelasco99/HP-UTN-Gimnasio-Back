import { RutinaController          } from './RutinaController';
import { Router                    } from 'express';

export const rutinaRouter = Router();

rutinaRouter.get('/', (req, res) => {
    res.json({
        data : "Rutina router"
    });
});

rutinaRouter.get('/listar', (req, res) => {
    RutinaController.listar(req, res);
});

rutinaRouter.get('/:id/obtener', (req, res) => {
    RutinaController.obtener(req, res);
});

rutinaRouter.post('/agregar', (req, res) => {
    RutinaController.agregar(req, res);
});

rutinaRouter.post('/editar', (req, res) => {
    RutinaController.actualizar(req, res);
});

rutinaRouter.get('/:id/eliminar', (req, res) => {
    RutinaController.eliminar(req, res);
});
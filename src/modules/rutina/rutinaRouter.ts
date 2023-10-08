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

rutinaRouter.post('/agregar', (req, res) => {
    RutinaController.agregar(req, res);
});
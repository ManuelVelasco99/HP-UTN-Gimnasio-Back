import { RutinaPresetController } from './RutinaPresetController';
import { Router                    } from 'express';

export const rutinaPresetRouter = Router();

rutinaPresetRouter.get('/', (req, res) => {
    res.json({
        data : "Rutina Preset route"
    });
});

rutinaPresetRouter.get('/listar', (req, res) => {
    RutinaPresetController.listar(req, res);
});

rutinaPresetRouter.post('/agregar', (req, res) => {
    RutinaPresetController.agregar(req, res);
});
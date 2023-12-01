import { RutinaPresetController     } from './RutinaPresetController';
import { Router                     } from 'express';

export const rutinaPresetRouter = Router();

rutinaPresetRouter.get('/', (req, res) => {
    res.json({
        data : "Rutina Preset route"
    });
});

rutinaPresetRouter.get('/listar', (req, res) => {
    RutinaPresetController.listar(req, res);
});
rutinaPresetRouter.get('/:id/obtener', (req, res) => {
    RutinaPresetController.obtener(req, res);
});
rutinaPresetRouter.get('/:id/eliminar', (req, res) => {
    RutinaPresetController.eliminar(req, res);
});
rutinaPresetRouter.post('/agregar', (req, res) => {
    RutinaPresetController.agregar(req, res);
});
rutinaPresetRouter.post('/editar', (req, res) => {
    RutinaPresetController.actualizar(req, res);
});
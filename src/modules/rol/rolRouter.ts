import { RolController } from './RolController';
import { Router        } from 'express';

export const rolRouter = Router();

rolRouter.get('/', (req, res) => {
    res.json({
        data : "Rol route"
    });
});

rolRouter.get('/listar', (req, res) => {
    RolController.listar(req, res);
});

rolRouter.post('/agregar', (req, res) => {
    RolController.agregar(req, res);
});


rolRouter.post('/:id/actualizar', (req, res) => {
    RolController.actualizar(req, res);
});
import { Router               } from 'express';
import { SocioClaseController } from './SocioClaseController';

export const socioClaseRouter = Router();

socioClaseRouter.get('/', (req, res) => {
    res.json({
        data : "SocioClase route"
    });
});

socioClaseRouter.get('/listar', (req, res) => {
    SocioClaseController.listar(req, res);
});

socioClaseRouter.post('/agregar', (req, res) => {
    SocioClaseController.agregar(req, res);
});


socioClaseRouter.post('/:id/actualizar', (req, res) => {
    SocioClaseController.actualizar(req, res);
});
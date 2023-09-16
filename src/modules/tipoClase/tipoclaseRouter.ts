import { Router              } from 'express';
import { TipoClaseController } from './TipoClaseController';

export const tipoclaseRouter = Router();

tipoclaseRouter.get('/', (req, res) => {
    res.json({
        data : "TipoClase route"
    });
});

tipoclaseRouter.get('/listar', (req, res) => {
    TipoClaseController.listar(req, res);
});

tipoclaseRouter.post('/agregar', (req, res) => {
    TipoClaseController.agregar(req, res);
});
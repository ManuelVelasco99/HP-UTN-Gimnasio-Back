import { PrecioCuotaController } from './PrecioCuotaController';
import { Router                    } from 'express';

export const precioCuotaRouter = Router();

precioCuotaRouter.get('/', (req, res) => {
    res.json({
        data : "Precio Cuota route"
    });
});

precioCuotaRouter.get('/listar', (req, res) => {
    PrecioCuotaController.listar(req, res);
});

precioCuotaRouter.post('/agregar', (req, res) => {
    PrecioCuotaController.agregar(req, res);
});
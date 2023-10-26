import { CuotaMensualController } from './CuotaMensualController';
import { Router                    } from 'express';

export const precioCuotaRouter = Router();

precioCuotaRouter.get('/', (req, res) => {
    res.json({
        data : "Precio Cuota route"
    });
});

precioCuotaRouter.get('/listar', (req, res) => {
    CuotaMensualController.listar(req, res);
});

precioCuotaRouter.post('/agregar', (req, res) => {
    CuotaMensualController.agregar(req, res);
});
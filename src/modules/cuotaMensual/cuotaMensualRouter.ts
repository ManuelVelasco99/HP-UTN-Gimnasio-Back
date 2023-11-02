import { CuotaMensualController    } from './CuotaMensualController';
import { Router                    } from 'express';

export const cuotaMensualRouter = Router();

cuotaMensualRouter.get('/', (req, res) => {
    res.json({
        data : "Precio Cuota route"
    });
});

cuotaMensualRouter.get('/listar', (req, res) => {
    CuotaMensualController.listar(req, res);
});

cuotaMensualRouter.post('/agregar', (req, res) => {
    CuotaMensualController.agregar(req, res);
});
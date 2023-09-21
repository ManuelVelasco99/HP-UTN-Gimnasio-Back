import { MaquinaElementoController } from './MaquinaElementoController';
import { Router                    } from 'express';

export const maquinaElementoRouter = Router();

maquinaElementoRouter.get('/', (req, res) => {
    res.json({
        data : "Maquina Elemento route"
    });
});

maquinaElementoRouter.get('/listar', (req, res) => {
    MaquinaElementoController.listar(req, res);
});

maquinaElementoRouter.post('/agregar', (req, res) => {
    MaquinaElementoController.agregar(req, res);
});
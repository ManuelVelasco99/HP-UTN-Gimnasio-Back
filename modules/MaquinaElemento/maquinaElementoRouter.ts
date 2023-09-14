import { Router } from 'express';

export const maquinaElementoRouter = Router();

maquinaElementoRouter.get('/', (req, res) => {
    res.json({
        data : "Maquina Elemento route"
    });
});
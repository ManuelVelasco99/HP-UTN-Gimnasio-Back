import { Router                } from 'express';
import { RutinaSocioController } from './RutinaSocioController';

export const rutinaSocioRouter = Router();

rutinaSocioRouter.get('/listar', (req, res) => {
    RutinaSocioController.listar(req, res);
});

rutinaSocioRouter.post('/:idEjercicio/agregar-nota', (req, res) => {
    RutinaSocioController.agregarNota(req, res);
});
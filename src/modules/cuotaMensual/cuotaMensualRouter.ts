import { CuotaMensualController    } from './CuotaMensualController';
import { Router                    } from 'express';

export const cuotaMensualRouter = Router();

cuotaMensualRouter.get('/', (req, res) => {
    res.json({
        data : "Cuota Mensual route"
    });
});

cuotaMensualRouter.get('/listar', (req, res) => {
    CuotaMensualController.listar(req, res);
});

cuotaMensualRouter.post('/agregar', (req, res) => {
    CuotaMensualController.agregar(req, res);
});

cuotaMensualRouter.post(
    '/validar-pago',
    CuotaMensualController.validarPago
);

cuotaMensualRouter.post('/reportePagosCuota', (req, res) => {
    CuotaMensualController.reportePagosCuota(req, res);
});

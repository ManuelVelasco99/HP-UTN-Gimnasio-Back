import { Router } from "express";
import { UsuarioController } from "./UsuarioController";
import { Usuario } from "../../entity/Usuario";

export const usuarioRouter = Router();

usuarioRouter.get('/', (req, res) => {
    res.json({
        data : "Usuario route"
    });
});

usuarioRouter.get('/listar', (req,res) => {
    UsuarioController.listar(req,res);
})
usuarioRouter.post('/agregar', (req,res)=>{
    UsuarioController.agregar(req, res);
})



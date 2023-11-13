import { AuthController } from "../modules/auth/AuthController";
import { NextFunction   } from "express";
import { Request        } from "express-serve-static-core";
import { Response       } from "express-serve-static-core";
import   jwt             from "jsonwebtoken"; 


export class Middlewares {

    public static async verifyToken(req : Request<any>, res : Response<any>, next : NextFunction) : Promise<void> {
        let token = req.header("access-token") || "";

        try{
            jwt.verify(token,process.env.SECRET_WORD || "?");
            next();
        }
        catch(error : any){
            res.status(403).json({
                message: "Acceso denegado"
            });
        }

        
    }

    public static async validarRolDelEncargado(req : Request<any>, res : Response<any>, next : NextFunction) : Promise<void> {
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));

        if(tokenDecoded.rol_id === 1){
            next();
        }
        else{
            res.status(403).json({
                message: "Acceso denegado"
            });
        }
        
    }

    public static async validarRolDelProfesor(req : Request<any>, res : Response<any>, next : NextFunction) : Promise<void> {
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));

        if(tokenDecoded.rol_id === 2){
            next();
        }
        else{
            res.status(403).json({
                message: "Acceso denegado"
            });
        }
        
    }

    public static async validarRolDelProfesorOEncargado(req : Request<any>, res : Response<any>, next : NextFunction) : Promise<void> {
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));

        if(tokenDecoded.rol_id === 2 || tokenDecoded.rol_id === 1){
            next();
        }
        else{
            res.status(403).json({
                message: "Acceso denegado"
            });
        }
        
    }

    public static async validarRolDelSocio(req : Request<any>, res : Response<any>, next : NextFunction) : Promise<void> {
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));

        if(tokenDecoded.rol_id === 4){
            next();
        }
        else{
            res.status(403).json({
                message: "Acceso denegado"
            });
        }
        
    }

}

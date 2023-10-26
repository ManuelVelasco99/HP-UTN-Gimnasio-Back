import { NextFunction  } from "express";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";
import   jwt             from "jsonwebtoken"; 


export class Middlewares {

    public static async verifyToken(req : Request<any>, res : Response<any>, next : NextFunction) : Promise<void> {
        let token = req.header("access-token") || "";

        try{
            jwt.verify(token,process.env.SECRET_WORD || "?")

        }
        catch(error : any){
            res.status(403).json({
                message: "Acceso denegado"
            });
        }

        next();
    }

}

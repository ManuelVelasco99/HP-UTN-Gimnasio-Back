import { AppDataSource } from "../../data-source";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";
import { TipoClase     } from "../../entity/TipoClase";

export class TipoClaseController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tiposClase = await AppDataSource.manager.find(TipoClase);

        res.json({
            data : tiposClase
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tipoClase = new TipoClase();

        tipoClase.descripcion = req.body.descripcion;
        tipoClase.cupo        = req.body.cupo;

        tipoClase = await AppDataSource.manager.save(tipoClase);

        res.json({
            data : tipoClase
        })
    }
}
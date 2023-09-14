import { AppDataSource   } from "../../data-source";
import { MaquinaElemento } from "../../entity/MaquinaElemento";
import { Request         } from "express-serve-static-core";
import { Response        } from "express-serve-static-core";

export class MaquinaElementoController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let maquinasElementos = await AppDataSource.manager.find(MaquinaElemento);

        res.json({
            data : maquinasElementos
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let maquinaElemento = new MaquinaElemento();

        maquinaElemento.descripcion = req.body.descripcion;
        maquinaElemento.estado      = true;

        maquinaElemento = await AppDataSource.manager.save(maquinaElemento);

        res.json({
            data : maquinaElemento
        })
    }
}
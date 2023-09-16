import { AppDataSource   } from "../../data-source";
import { MaquinaElemento } from "../../entity/MaquinaElemento";
import { Request         } from "express-serve-static-core";
import { Response        } from "express-serve-static-core";
import { TipoEjercicio   } from "../../entity/TipoEjercicio";

export class TipoEjercicioController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tiposEjercicio = await AppDataSource.manager.find(TipoEjercicio, {relations : {maquinaElemento : true}});

        res.json({
            data : tiposEjercicio
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tipoEjercicio = new TipoEjercicio();

        tipoEjercicio.descripcion = req.body.descripcion;
        tipoEjercicio.nombre = req.body.nombre;
        tipoEjercicio.multimedia = req.body.multimedia;
        let maquiElementoId = req.body.maquinaElemento;

        let maquinaElemento : MaquinaElemento | null = null;
        if(maquiElementoId){
            maquinaElemento = await AppDataSource.manager.findOneBy(MaquinaElemento,{ id: maquiElementoId });
        }
        tipoEjercicio.maquinaElemento = maquinaElemento;

        tipoEjercicio = await AppDataSource.manager.save(tipoEjercicio);

        res.json({
            data : tipoEjercicio
        })
    }
}
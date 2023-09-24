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
        /*
        if(!maquinaElemento){
            return;
        }
        maquinaElemento.estado=true;
        maquinaElemento = await AppDataSource.manager.save(maquinaElemento);
        */
        tipoEjercicio.maquinaElemento = maquinaElemento;

        tipoEjercicio = await AppDataSource.manager.save(tipoEjercicio);

        res.json({
            data : tipoEjercicio
        })
    }

    public static async actualizar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tipoEjercicioId = req.params.id;
        let tipoEjercicio = await AppDataSource.manager.findOneBy(TipoEjercicio,{ id: tipoEjercicioId });
        if(!tipoEjercicio){
            return;
        }
        tipoEjercicio.nombre = req.body.nombre;
        tipoEjercicio.descripcion = req.body.descripcion;
        tipoEjercicio.multimedia = req.body.multimedia;
        ///busco la id de maquinaElemento del tipo ejercicio
        let maquinaElementoId = req.body.maquiElementoId
        let maquinaElemento : MaquinaElemento | null = null;
        if(maquinaElementoId){
            maquinaElemento = await AppDataSource.manager.findOneBy(MaquinaElemento,{ id: maquinaElementoId });
        }
        tipoEjercicio.maquinaElemento = maquinaElemento;

        tipoEjercicio = await AppDataSource.manager.save(tipoEjercicio);

        res.json({
            data : tipoEjercicio
        })
    }
}
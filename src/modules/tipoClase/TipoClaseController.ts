import { AppDataSource   } from "../../data-source";
import { FindManyOptions } from "typeorm";
import { Like            } from "typeorm";
import { Request         } from "express-serve-static-core";
import { Response        } from "express-serve-static-core";
import { TipoClase       } from "../../entity/TipoClase";

export class TipoClaseController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {

        let options : FindManyOptions<TipoClase> = {}

        if(req.query.descripcion){
            options.where = {
                descripcion: Like("%"+req.query.descripcion+"%")
            }
        }

        let tiposClase = await AppDataSource.manager.find(TipoClase, options);

        res.json({
            data : tiposClase,
        })
    }

    public static async obtener(req : Request<any>, res : Response<any>) : Promise<void> {
        let tipoClaseId = req.params.id;
        let tipoClase   = await AppDataSource.manager.findOneBy(TipoClase,{ id: tipoClaseId });

        res.json({
            data : tipoClase
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

    public static async editar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tipoClaseId = req.params.id;
        let tipoClase = await AppDataSource.manager.findOneBy(TipoClase,{ id: tipoClaseId });
        if(!tipoClase){
            return;
        }

        tipoClase.descripcion = req.body.descripcion;
        tipoClase.cupo        = req.body.cupo;

        tipoClase = await AppDataSource.manager.save(tipoClase);

        res.json({
            data : tipoClase
        })
    }
}
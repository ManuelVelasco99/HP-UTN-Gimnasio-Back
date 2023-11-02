import { promises } from "dns";
import { AppDataSource      } from "../../data-source";
import { RutinaPreset       } from "../../entity/RutinaPreset";
import { Request            } from "express-serve-static-core";
import { Response           } from "express-serve-static-core";

export class RutinaPresetController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        //let rutinasPresets = await AppDataSource.manager.find(RutinaPreset);
        let rutinasPreset = await AppDataSource.manager
        .createQueryBuilder('rutina_preset', 'rp')
        .select('rp.id, rp.nombre, ("----")"nombre_socio", ("----")"nombre_profesor", date_format(rp.fecha_creacion, "%Y-%m-%d")"fecha_creacion"')
        .getRawMany();        
        res.json({
            data : rutinasPreset
        })
    }
    public static async obtenerMaxId(req:Request<any>, res:Response<any>): Promise<void>{
        let rutinaPreset = await AppDataSource.manager
        .createQueryBuilder('rutina_preset','rp')
        .select('max(id)')
        .getOne();
        res.json(
            {
                data:rutinaPreset
            }
        )
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let rutinaPreset = new RutinaPreset();
        let fechaHoy = new Date();
        // rutinaPreset.nombre = req.body.nombre;
        // rutinaPreset.fecha_creacion = fechaHoy; //Seba: le puse que cargue derecho la fecha del dia que se carga
        // rutinaPreset = await AppDataSource.manager.save(rutinaPreset);
        console.log(req.body.nombreRutina);
        console.log(req.body.ejercicios);
        // res.json({
        //     data : rutinaPreset
        // })
    }
}
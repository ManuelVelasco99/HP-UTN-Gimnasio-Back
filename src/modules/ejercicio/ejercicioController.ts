import { AppDataSource } from "../../data-source";
import { Ejercicio     } from "../../entity/Ejercicio";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";
import { TipoEjercicio } from "../../entity/TipoEjercicio";

export class EjercicioController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let ejercicios = await AppDataSource.manager.find(Ejercicio);

        res.json({
            data : ejercicios
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let ejercicio = new Ejercicio();

        ejercicio.repeticiones=req.body.repeticiones;
        ejercicio.diaRutina=req.body.diaRutina;
        ejercicio.series=req.body.series;

        ejercicio = await AppDataSource.manager.save(ejercicio);

        /* No se como modificar el tipo de ejercicio
        let tipoEjercicio!: TipoEjercicio;
        if(tipoEjercicio){
            tipoEjercicio = await AppDataSource.manager.findOneBy(TipoEjercicio,{ id: tipoEjercicio.id });
        }
        ejercicio.tiposEjercicio=tipoEjercicio;
        
        ejercicio = await AppDataSource.manager.save(ejercicio);
        */

        res.json({
            data : ejercicio
        })
    }
    
    
    public static async actualizar(req : Request<any>, res : Response<any>) : Promise<void> {
        let ejercicioId = req.params.id;
        let ejercicio = await AppDataSource.manager.findOneBy(Ejercicio,{ id: ejercicioId });
        if(!ejercicio){
            return;
        }
        
        ejercicio.repeticiones=req.body.repeticiones;
        ejercicio.diaRutina=req.body.diaRutina;
        ejercicio.series=req.body.series;
        
        /*
        ///busco la id de ejercicio de la nota
        let ejercicioId = req.body.ejercicioId
        let ejercicio : Ejercicio | null = null;
        if(ejercicioId){
            ejercicio = await AppDataSource.manager.findOneBy(Ejercicio,{ id: ejercicioId });
        }
        nota.ejercicio = ejercicio;
        */

        ejercicio = await AppDataSource.manager.save(ejercicio);

        res.json({
            data : ejercicio
        })
    }

}
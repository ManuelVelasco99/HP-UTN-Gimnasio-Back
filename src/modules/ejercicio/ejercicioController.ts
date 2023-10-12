import { AppDataSource } from "../../data-source";
import { Ejercicio     } from "../../entity/Ejercicio";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";
import { TipoEjercicio } from "../../entity/TipoEjercicio";
import { Rutina        } from "../../entity/Rutina";
import { RutinaPreset  } from "../../entity/RutinaPreset";

export class EjercicioController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let ejercicios = await AppDataSource.manager.find(Ejercicio);

        res.json({
            data : ejercicios
        })
    }

    public static async agregar(
        ejercicioRepeticiones:string,
        ejercicioDiaRutina:number,
        ejercicioSeries:number,
        rutinaId: number | null,
        rutinaPresetId:number | null,
        tipoEjercicioId:number,
    ) : Promise<Ejercicio> {

        let ejercicio= new Ejercicio();

        ejercicio.repeticiones=ejercicioRepeticiones;
        ejercicio.diaRutina=ejercicioDiaRutina;
        ejercicio.series=ejercicioSeries;

        if (rutinaId){
            let rutina: Rutina | null = null;
            rutina= await AppDataSource.manager.findOneBy(Rutina,{id: rutinaId});
            if(rutina){
                ejercicio.rutina=rutina;
            }
            //else{}  falta en caso de que traiga Null
        }

        if (rutinaPresetId){
            let rutinaPreset: RutinaPreset | null = null;
            rutinaPreset= await AppDataSource.manager.findOneBy(RutinaPreset,{id: rutinaPresetId});
            if(rutinaPreset){
                ejercicio.rutinaPreset=rutinaPreset;
            }
            //else{}  falta en caso de que traiga Null
        }

        
        let idTipoEjercicio= tipoEjercicioId;
        
        let tipoEjercicio : TipoEjercicio | null = null;
        tipoEjercicio= await AppDataSource.manager.findOneBy(TipoEjercicio,{ id: idTipoEjercicio });
        if(tipoEjercicio){
            ejercicio.tiposEjercicio=tipoEjercicio;
        }
        //else{}  falta en caso de que traiga Null
 
        return await AppDataSource.manager.save(ejercicio);        
    }
    
    public static async actualizar(
        ejercicioId:number,
        ejercicioRepeticiones:string,
        ejercicioDiaRutina:number,
        ejercicioSeries:number,
        rutinaId: number | null,
        rutinaPresetId:number | null,
        tipoEjercicioId:number,
    ) : Promise<Ejercicio | null> {

        let ejercicio = await AppDataSource.manager.findOneBy(Ejercicio,{ id: ejercicioId });
        if(!ejercicio){
            return null;
        }
        
        ejercicio.repeticiones=ejercicioRepeticiones;
        ejercicio.diaRutina=ejercicioDiaRutina;
        ejercicio.series=ejercicioSeries;

        if (rutinaId){
            let rutina: Rutina | null = null;
            rutina= await AppDataSource.manager.findOneBy(Rutina,{id: rutinaId});
            if(rutina){
                ejercicio.rutina=rutina;
            }
            //else{}  falta en caso de que traiga Null
        }

        if (rutinaPresetId){
            let rutinaPreset: RutinaPreset | null = null;
            rutinaPreset= await AppDataSource.manager.findOneBy(RutinaPreset,{id: rutinaPresetId});
            if(rutinaPreset){
                ejercicio.rutinaPreset=rutinaPreset;
            }
            //else{}  falta en caso de que traiga Null
        }

        
        let idTipoEjercicio= tipoEjercicioId;
        
        let tipoEjercicio : TipoEjercicio | null = null;
        tipoEjercicio= await AppDataSource.manager.findOneBy(TipoEjercicio,{ id: idTipoEjercicio });
        if(tipoEjercicio){
            ejercicio.tiposEjercicio=tipoEjercicio;
        }
        //else{}  falta en caso de que traiga Null
 
        ejercicio = await AppDataSource.manager.save(ejercicio);

        return ejercicio;

    }

}
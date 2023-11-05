import { promises } from "dns";
import { AppDataSource      } from "../../data-source";
import { RutinaPreset       } from "../../entity/RutinaPreset";
import { Request            } from "express-serve-static-core";
import { Response           } from "express-serve-static-core";
import { Ejercicio } from "../../entity/Ejercicio";
import { TipoEjercicio } from "../../entity/TipoEjercicio";

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
    public static async obtener(req : Request<any>, res : Response<any>) : Promise<void> {
        //let rutinaPreset = await AppDataSource.manager.findOneBy(RutinaPreset, {id: req.params.dni});
        //let socio = await AppDataSource.manager.findOneBy(SocioClase, {usuario: usu});
        let idR = req.params.id;
        let rutinaPreset = await AppDataSource.manager
        .createQueryBuilder('rutina_preset', 'rp')
        .innerJoinAndSelect('rp.ejercicio', 'ejercicios' )
        .where('rp.id = :id', {id: idR})
        .getRawMany(); 
        //.innerJoin('rut.socio', 'socio') . where("user.id = :id", { id: 1 })
        console.log(rutinaPreset);
        res.json({
            data : rutinaPreset
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let rutinaPreset = new RutinaPreset();
        let fechaHoy = new Date();
        let ejercicio; 
         rutinaPreset.nombre = req.body.nombreRutina;
         rutinaPreset.fecha_creacion = fechaHoy; //Seba: le puse que cargue derecho la fecha del dia que se carga
         rutinaPreset = await AppDataSource.manager.save(rutinaPreset);

         for(let i = 0; i < req.body.ejercicios.length; i++ ){
            for(let j =0; j < req.body.ejercicios[i].length; j++){    
                ejercicio = new Ejercicio();     
                ejercicio.tiposEjercicio    = await AppDataSource.manager.findOneBy(TipoEjercicio, {id : req.body.ejercicios[i][j].id_tipo_ejercicio});
                ejercicio.rutinaPreset      = rutinaPreset;
                ejercicio.diaRutina         = req.body.ejercicios[i][j].diaRutina;
                ejercicio.series            = req.body.ejercicios[i][j].series;
                ejercicio.repeticiones      = req.body.ejercicios[i][j].repeticiones;
                ejercicio                   = await AppDataSource.manager.save(ejercicio);
            }
        }
        res.json({
                data : "Rutina preset cargada"
         })

            // console.log("##########################################################");
            // console.log("#                                                        #");
            // console.log("Rutina: " , req.body.nombreRutina, " ID RUTINA CARGADA: ", rutinaPreset.id);
            // for(let i = 0; i < req.body.ejercicios.length; i++ ){
            //     console.log("Dia: ", req.body.ejercicios[i][0].diaRutina)
            //     for(let j =0; j < req.body.ejercicios[i].length; j++){
            //         console.log("   ",
            //             "Id tipo Ejercicio", req.body.ejercicios[i][j].id_tipo_ejercicio, 
            //             " Series: ", req.body.ejercicios[i][j].series , 
            //             " Repeticiones: ", req.body.ejercicios[i][j].repeticiones)
            //     }
            // }
            // console.log("#                                                        #");
            // console.log("##########################################################");
    }
}
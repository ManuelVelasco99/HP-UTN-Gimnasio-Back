import { AppDataSource       } from "../../data-source";
import { Ejercicio           } from "../../entity/Ejercicio";
import { EjercicioController } from "../ejercicio/ejercicioController";
import { Request             } from "express-serve-static-core";
import { Response            } from "express-serve-static-core";
import { Rutina              } from "../../entity/Rutina";
import { Usuario             } from "../../entity/Usuario";
import { TipoEjercicio } from "../../entity/TipoEjercicio";

export class RutinaController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        //let rutinas = await AppDataSource.manager.find(Rutina);
        let rutinas = await AppDataSource.manager
        .createQueryBuilder('rutina', 'rut')
        .select(' rut.id"id", socio.nombre"nombre_socio", profe.nombre"nombre_profesor", date_format(rut.fecha_creacion, "%Y-%m-%d")"fecha_creacion", rut.nombre"nombre" ')
        .innerJoin('rut.socio', 'socio')
        .innerJoin('rut.profesor', 'profe')
        .getRawMany();
        res.json({
            data : rutinas
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
            
            console.log("##########################################################");
            console.log("#                                                        #");
            console.log("Socio ----> ", req.body.usuario.nombre);
            console.log("Rutina: " , req.body.nombreRutina, " ID RUTINA CARGADA: ");
            for(let i = 0; i < req.body.ejercicios.length; i++ ){
                console.log("Dia: ", req.body.ejercicios[i][0].diaRutina)
                for(let j =0; j < req.body.ejercicios[i].length; j++){
                    console.log("   ",
                        "Id tipo Ejercicio", req.body.ejercicios[i][j].id_tipo_ejercicio, 
                        " Series: ", req.body.ejercicios[i][j].series , 
                        " Repeticiones: ", req.body.ejercicios[i][j].repeticiones)
                }
            }
            console.log("#                                                        #");
            console.log("##########################################################");


        let rutina                          = new Rutina();
        let fechaHoy                        = new Date();
        let ejercicio; 
        rutina.nombre                       = req.body.nombreRutina;
        rutina.socio                        = req.body.usuario;
        rutina.fecha_creacion               = fechaHoy; //Seba: le puse que cargue derecho la fecha del dia que se carga
        rutina = await AppDataSource.manager.save(rutina);

         for(let i = 0; i < req.body.ejercicios.length; i++ ){
            for(let j =0; j < req.body.ejercicios[i].length; j++){    
                ejercicio                   = new Ejercicio();     
                ejercicio.tiposEjercicio    = await AppDataSource.manager.findOneBy(TipoEjercicio, {id : req.body.ejercicios[i][j].id_tipo_ejercicio});
                ejercicio.rutina            = rutina;
                ejercicio.diaRutina         = req.body.ejercicios[i][j].diaRutina;
                ejercicio.series            = req.body.ejercicios[i][j].series;
                ejercicio.repeticiones      = req.body.ejercicios[i][j].repeticiones;
                ejercicio                   = await AppDataSource.manager.save(ejercicio);
            }
        }
        res.json({
                data : "Rutina cargada"
         })

    }

    public static async actualizar(req : Request<any>, res : Response<any>) : Promise<void> {
        let rutinaId = req.params.id;
        let rutina = await AppDataSource.manager.findOneBy(Rutina,{ id: rutinaId });
        if(!rutina){
            return;
        }
     
        rutina.nombre = req.body.nombre;
        rutina.fecha_creacion = req.body.fecha_creacion;


        let socioId=req.body.socioId;

        let socio : Usuario | null = null;
        socio= await AppDataSource.manager.findOneBy(Usuario,{ id: socioId });
        if(socio){
            rutina.socio=socio;
        }
        //else{}  falta en caso de que traiga Null
        
        let profesorId=req.body.profesorId;

        let profesor : Usuario | null = null;
        profesor= await AppDataSource.manager.findOneBy(Usuario,{ id: profesorId });
        if(profesor){
            rutina.profesor=profesor;
        }
        //else{}  falta en caso de que traiga Null


        rutina = await AppDataSource.manager.save(rutina);

        res.json({
            data : rutina
        })
    }
}
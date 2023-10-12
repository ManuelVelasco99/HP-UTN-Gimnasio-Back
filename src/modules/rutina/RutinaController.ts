import { AppDataSource       } from "../../data-source";
import { Ejercicio           } from "../../entity/Ejercicio";
import { EjercicioController } from "../ejercicio/ejercicioController";
import { Request             } from "express-serve-static-core";
import { Response            } from "express-serve-static-core";
import { Rutina              } from "../../entity/Rutina";
import { Usuario             } from "../../entity/Usuario";

export class RutinaController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let rutinas = await AppDataSource.manager.find(Rutina);

        res.json({
            data : rutinas
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {

        let rutina = new Rutina();

        rutina.nombre = req.body.nombre;
        rutina.fecha_creacion = new Date();

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

        let ejercicios : Ejercicio[] = [];

        for (const ejercicio of req.body.ejercicios) {
            let ejercicioInsertado = await EjercicioController.agregar(
                ejercicio.repeticiones,
                ejercicio.diaRutina,
                ejercicio.series,
                rutina.id,
                null,
                ejercicio.tiposEjercicio.id,
            );
            ejercicios.push(ejercicioInsertado);
        }

        rutina.ejercicios = ejercicios;
        res.json({
            data : rutina
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
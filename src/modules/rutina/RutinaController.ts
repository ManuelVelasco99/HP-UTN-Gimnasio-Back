import { AppDataSource   } from "../../data-source";
import { Ejercicio       } from "../../entity/Ejercicio";
import { Rutina          } from "../../entity/Rutina";
import { Request         } from "express-serve-static-core";
import { Response        } from "express-serve-static-core";

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
        rutina.fecha_creacion = req.body.fecha_creacion;


        let idEjercicio= req.body.idEjercicio;
        //Falta ver como guardar los ejercicios como coleccion
        let ejercicio : Ejercicio | null = null;
        
        ejercicio= await AppDataSource.manager.findOneBy(Ejercicio,{ id: idEjercicio });
        if(ejercicio){
            rutina.ejercicio=ejercicio;
        }
        //else{}  falta en caso de que traiga Null

        rutina = await AppDataSource.manager.save(rutina);

        res.json({
            data : rutina
        })
    }
}
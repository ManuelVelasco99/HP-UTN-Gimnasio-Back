import { AppDataSource } from "../../data-source";
import { Ejercicio } from "../../entity/Ejercicio";
import { Nota           } from "../../entity/Nota";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";

export class NotaController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let notas = await AppDataSource.manager.find(Nota);

        res.json({
            data : notas
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let nota = new Nota();

        nota.fecha = req.body.fecha;
        nota.peso= req.body.peso;
        nota.comentario=req.body.comentario;
        let idEjercicio= req.body.idEjercicio;

        nota = await AppDataSource.manager.save(nota);

        let ejercicio : Ejercicio | null = null;
        ejercicio= await AppDataSource.manager.findOneBy(Ejercicio,{ id: idEjercicio });
        if(ejercicio){
            nota.ejercicio=ejercicio;
        }
        //else{}  falta en caso de que traiga Null

        res.json({
            data : nota
        })
    }
    
    
    public static async actualizar(req : Request<any>, res : Response<any>) : Promise<void> {
        let notaId = req.params.id;
        let nota = await AppDataSource.manager.findOneBy(Nota,{ id: notaId });
        if(!nota){
            return;
        }
        nota.fecha = req.body.fecha;
        nota.peso= req.body.peso;
        nota.comentario=req.body.comentario;
        let idEjercicio= req.body.idEjercicio;


        let ejercicio : Ejercicio | null = null;
        ejercicio= await AppDataSource.manager.findOneBy(Ejercicio,{ id: idEjercicio });
        if(ejercicio){
            nota.ejercicio=ejercicio;
        }
        nota = await AppDataSource.manager.save(nota);

        res.json({
            data : nota
        })
    }

}
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

        nota = await AppDataSource.manager.save(nota);

        /* No se como modificar el ejercicio
        let ejercicio!: Ejercicio;
        if(ejercicio){
            ejercicio = await AppDataSource.manager.findOneBy(Ejercicio,{ id: ejercicio.id });
        }
        nota.ejercicio=ejercicio;
        
        nota = await AppDataSource.manager.save(nota);
        */

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
        
        /*
        ///busco la id de ejercicio de la nota
        let ejercicioId = req.body.ejercicioId
        let ejercicio : Ejercicio | null = null;
        if(ejercicioId){
            ejercicio = await AppDataSource.manager.findOneBy(Ejercicio,{ id: ejercicioId });
        }
        nota.ejercicio = ejercicio;
        */

        nota = await AppDataSource.manager.save(nota);

        res.json({
            data : nota
        })
    }

}
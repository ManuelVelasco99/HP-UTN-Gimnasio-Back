import { Double         } from "typeorm";
import { AppDataSource  } from "../../data-source";
import { Nota           } from "../../entity/Nota";
import { Ejercicio      } from "../../entity/Ejercicio";
import { Request        } from "express-serve-static-core";
import { Response       } from "express-serve-static-core";

export class NotaController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let notas = await AppDataSource.manager.find(Nota);

        res.json({
            data : notas
        })
    }

    public static async agregar(
        notaFecha : Date,
        notaPeso : Double,
        notaComentario : string,
        ejercicioId : number,
        ) : Promise<Nota> {
        
        let nota = new Nota();

        nota.fecha = notaFecha;
        nota.peso= notaPeso;
        nota.comentario=notaComentario;
 
        let ejercicio : Ejercicio | null = null;
        ejercicio= await AppDataSource.manager.findOneBy(Ejercicio,{ id: ejercicioId });
        if(ejercicio){
            nota.ejercicio=ejercicio;
        }
        //else{}  falta en caso de que traiga Null
        
        nota = await AppDataSource.manager.save(nota);
       
        return nota
    }
    
    
    public static async actualizar(
        notaId: number,
        notaFecha : Date,
        notaPeso : Double,
        notaComentario : string,
        ejercicioId : number,        
    ) : Promise<Nota | null> {

        let nota = await AppDataSource.manager.findOneBy(Nota,{ id: notaId });
        if(!nota){
            return null;
        }

        nota.fecha = notaFecha;
        nota.peso= notaPeso;
        nota.comentario=notaComentario;
        
        let ejercicio : Ejercicio | null = null;
        ejercicio= await AppDataSource.manager.findOneBy(Ejercicio,{ id: ejercicioId });
        if(ejercicio){
            nota.ejercicio=ejercicio;
        }
        //else{}  falta en caso de que traiga Null
        
        nota = await AppDataSource.manager.save(nota);
        
        return nota
    }

}
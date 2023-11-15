import { AppDataSource } from "../../data-source";
import { TipoClase     } from "../../entity/TipoClase";
import { Usuario       } from "../../entity/Usuario";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";
import { Clase         } from "../../entity/Clase";

export class ClaseController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        
        let clases = await AppDataSource.getRepository(Clase).createQueryBuilder("clase").select(["clase.id","clase.fecha","clase.horario_inicio", "clase.horario_fin", "clase.tipoClaseId, usuarioId"])
        .leftJoinAndSelect("clase.tipoClase", "tipoClase")
        .leftJoinAndSelect("clase.usuario", "usuario")
        .getMany();

        let clasesParseadas : any = clases;

        clasesParseadas.forEach((element : any) => {
            element["clase"] = element.tipoClase.descripcion;
            element["cupo"] = element.tipoClase.cupo;
            element["profesor"] = element.usuario.nombre +" "+ element.usuario.apellido;
        });

        res.json({
            data : clasesParseadas
        });
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let clase = new Clase();

        clase.fecha = req.body.fecha;
        clase.horario_inicio = req.body.horario_inicio;
        clase.horario_fin = req.body.horario_fin;
        let tipoClaseId = req.body.tipoClase;
        let usuarioId = req.body.profesor;

        let tipoClase : TipoClase | null = null;
        if(tipoClaseId){
            tipoClase = await AppDataSource.manager.findOneBy(TipoClase,{ id: tipoClaseId });
        }
        if(tipoClase) clase.tipoClase = tipoClase;

        let usuario : Usuario | null = null;
        if(usuarioId){
            usuario = await AppDataSource.manager.findOneBy(Usuario, { id: usuarioId});
        }
        clase.usuario = usuario

        clase = await AppDataSource.manager.save(clase);

        res.json({
            data : clase
        })
    }

    public static async actualizar(req : Request<any>, res : Response<any>) : Promise<void> {
        let claseId = req.params.id;

        let clase = await AppDataSource.manager.findOneBy(Clase,{ id: claseId });
        if(!clase){
            res.status(404).json({ error: 'Clase no encontrada' });
            return;
        }
        clase.fecha = req.body.fecha;
        clase.horario_inicio = req.body.horario_inicio;
        clase.horario_fin = req.body.horario_fin;
        ///busco la id de tipoClase de la clase
        let tipoClaseId = req.body.tipoClase
        let tipoClase : TipoClase | null = null;
        if(tipoClaseId){
            tipoClase = await AppDataSource.manager.findOneBy(TipoClase,{ id: tipoClaseId });
        }
        if(tipoClase) clase.tipoClase = tipoClase;

        ///busco la id del profesor de la clase
        let usuarioId = req.body.profesor
        let usuario : Usuario | null = null;
        if(usuarioId){
            usuario = await AppDataSource.manager.findOneBy(Usuario,{ id: usuarioId });
        }
        clase.usuario = usuario;

        clase = await AppDataSource.manager.save(clase);

        res.json({
            data : clase
        })
    }

    public static async obtener(req : Request<any>, res : Response<any>) : Promise<void> {
        let id = req.params.id;
        let clases = await AppDataSource.getRepository(Clase).createQueryBuilder("clase").select(["clase.id","clase.fecha","clase.horario_inicio", "clase.horario_fin", "clase.tipoClaseId, usuarioId"])
        .leftJoinAndSelect("clase.tipoClase", "tipoClase")
        .leftJoinAndSelect("clase.usuario", "usuario")
        .where("clase.id = :id", { id })
        .getOne();
        
        if (clases) {
            const claseParseada = {
              id: clases.id,
              fecha: clases.fecha,
              horario_inicio: clases.horario_inicio,
              horario_fin: clases.horario_fin,
              tipoClase: clases.tipoClase.id,
              cupo: clases.tipoClase.cupo,
              profesor: clases.usuario?.id
            };
          
            res.json({
              data: claseParseada
            });
          } else {
            res.status(404).json({ error: 'Clase no encontrada' });
          }
    }
}
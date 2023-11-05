import { AppDataSource } from "../../data-source";
import { Clase         } from "../../entity/Clase";
import { Usuario       } from "../../entity/Usuario";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";
import { SocioClase    } from "../../entity/SocioClase";
import { userInfo } from "os";
import { TipoClase     } from "../../entity/TipoClase";

export class SocioClaseController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let socioClase = await AppDataSource.manager.find(SocioClase, {relations : {clase : true, usuario : true}});

        res.json({
            data : socioClase
        })
    }



    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let socioClase = new SocioClase();

        socioClase.fecha_inscripcion = req.body.fecha_inscripcion;
        socioClase.asistencia = req.body.asistencia;
        let claseId = req.body.clase;
        let usuarioId = req.body.usuario;

        let clase : Clase | null = null;
        if(claseId){
            clase = await AppDataSource.manager.findOneBy(Clase,{ id: claseId });
        }
        socioClase.clase = clase;

        let usuario : Usuario | null = null;
        if(usuarioId){
            usuario = await AppDataSource.manager.findOneBy(Usuario, { id: usuarioId});
        }
        socioClase.usuario = usuario

        socioClase = await AppDataSource.manager.save(socioClase);

        res.json({
            data : socioClase
        })
    }

    public static async actualizar(req : Request<any>, res : Response<any>) : Promise<void> {
        let socioClaseId = req.params.id;
        let socioClase = await AppDataSource.manager.findOneBy(SocioClase,{ id: socioClaseId });
        if(!socioClase){
            res.status(404).json({ error: 'SocioClase no encontrada' });
            return;
        }
        socioClase.fecha_inscripcion = req.body.fecha_inscripcion;
        socioClase.asistencia = req.body.asistencia;
        ///busco la id de clase del socioClase
        let claseId = req.body.clase
        let clase : Clase | null = null;
        if(claseId){
            clase = await AppDataSource.manager.findOneBy(Clase,{ id: claseId });
        }
        socioClase.clase = clase;

        ///busco la id del socio del socioClase
        let usuarioId = req.body.usuario
        let usuario : Usuario | null = null;
        if(usuarioId){
            usuario = await AppDataSource.manager.findOneBy(Usuario,{ id: usuarioId });
        }
        socioClase.usuario = usuario;

        socioClase = await AppDataSource.manager.save(socioClase);

        res.json({
            data : socioClase
        })
    }
}
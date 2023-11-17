import { AppDataSource         } from "../../data-source";
import { TipoClase             } from "../../entity/TipoClase";
import { Usuario               } from "../../entity/Usuario";
import { Request               } from "express-serve-static-core";
import { Response              } from "express-serve-static-core";
import { Clase                 } from "../../entity/Clase";
import { FindManyOptions, Like, MoreThanOrEqual } from "typeorm";
import { AuthController        } from "../auth/AuthController";
import { SocioClase } from "../../entity/SocioClase";

export class ClaseController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let options : FindManyOptions<Clase> = {}
        console.log("req.query",req.query)
        console.log("req.query.clase",req.query.clase)
        console.log("req.query.profesor",req.query.profesor)

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        options.where = {
            fecha: MoreThanOrEqual(yesterday)
        };
         
        let query =`
            SELECT clase.*, tipo_clase.descripcion as clase, tipo_clase.cupo as cupo, CONCAT(usuario.nombre, ' ',usuario.apellido) as profesor
            FROM clase
            INNER JOIN tipo_clase ON tipo_clase.id = clase.tipoClaseId
            INNER JOIN usuario ON clase.usuarioId = usuario.id
            WHERE clase.fecha >= '${yesterday.toISOString()}'

        `;
        let extraQuery = "";
        if(req.query.clase && req.query.profesor){
            extraQuery = ` AND (
                CONCAT(usuario.nombre, ' ',usuario.apellido) LIKE '%${req.query.profesor}%'
                AND tipo_clase.descripcion LIKE '%${req.query.clase}%')
            `;
        }
        else{
            if(req.query.clase){
                extraQuery = ` AND tipo_clase.descripcion LIKE '%${req.query.clase}%'`;
            }
            if(req.query.profesor){
                extraQuery = ` AND CONCAT(usuario.nombre, ' ',usuario.apellido) LIKE '%${req.query.profesor}%'`;
            }
        }
        let clases : any = await AppDataSource.manager.query(query+extraQuery);


        clases.forEach((element : any) => {
            element.fecha = element.fecha.toISOString().split("T")[0];
            element.horario_inicio = element.horario_inicio.substring(0, element.horario_inicio.length - 3);
            element.horario_fin = element.horario_fin.substring(0, element.horario_fin.length - 3);
        });


        res.json({
            data : clases
        });
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let clase = new Clase();
        clase.fecha = req.body.fecha;
        clase.horario_inicio = req.body.horario_inicio;
        clase.horario_fin = req.body.horario_fin;
        let tipoClaseId = req.body.tipoClase;
        let profeId = req.body.profesor;

        let tipoClase : TipoClase | null = null;
        if(tipoClaseId){
            tipoClase = await AppDataSource.manager.findOneBy(TipoClase,{ id: tipoClaseId });
        }

        let usuario : Usuario | null = null;
        if(profeId){
            usuario = await AppDataSource.manager.findOneBy(Usuario, { id: profeId});
        }

        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idUsuario = tokenDecoded.id;
        let rolIdUsuario = tokenDecoded.rol_id
        let usu =  await AppDataSource.manager.findOneBy(Usuario, {id: idUsuario});
        if(!usu){
            return;
        }

        

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const fechaClase = new Date(clase.fecha);

        if (!(fechaClase.getTime() <= yesterday.getTime())) {
            
            if(tipoClase) clase.tipoClase = tipoClase;
            clase.usuario = usuario;

            clase = await AppDataSource.manager.save(clase);

            res.json({
                data : clase
            });
        }
        else{
            res.status(409).json({
                message : "error al agregar una nueva clase"
            });
        }
        
    }


    public static async editar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idUsuario = tokenDecoded.id;
        let claseId = req.params.id;
        let clase = await AppDataSource.manager.findOneBy(Clase,{ id: claseId });
        
        
        if(!clase){
            res.status(404).json({ error: 'Clase no encontrada' });
            return;
        }

        clase.fecha = req.body.fecha;
        clase.horario_inicio = req.body.horario_inicio;
        clase.horario_fin = req.body.horario_fin;
        let tipoClaseId = req.body.tipoClase;
        let profeId = req.body.profesor;

        let tipoClase : TipoClase | null = null;
        if(tipoClaseId){
            tipoClase = await AppDataSource.manager.findOneBy(TipoClase,{ id: tipoClaseId });
        }
        

        let usuario : any = await AppDataSource.manager.query(`
            SELECT usuario.*
            FROM usuario
            WHERE usuario.id = '${tokenDecoded.id}'
        `);

        

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const fechaClase = new Date(clase.fecha);

        let puedeEditarLaClase = ClaseController.puedeEditarLaClase(usuario,clase);

        if(!puedeEditarLaClase){
            res.status(409).json({
                message : "No puedes editar la clase de otro profesor"
            });
        }

        if (!(fechaClase.getTime() <= yesterday.getTime())) {
            
            if(tipoClase) clase.tipoClase = tipoClase;
            clase.usuario = usuario

            clase = await AppDataSource.manager.save(clase);

            res.json({
                data : clase
            })
        }
        else{
            res.status(409).json({
                message : "Error al editar una nueva clase"
            });
            return;
        }

    }

    private static puedeEditarLaClase(usuario : any, clase : Clase) {
        if(usuario.rol_id === 2 && clase.usuario?.id !== usuario.id){
            return false;
        }
        return true;
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

    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void>{
        let idC = req.params.id;
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idUsuario = tokenDecoded.id;
        let rolIdUsuario = tokenDecoded.rol_id
        ///// VALIDAR EL Usuario /////
        let clase = await AppDataSource.manager.findOne(Clase, {where : {id: idC}, relations : {usuario : true, tipoClase : true}});
        let usuario =  await AppDataSource.manager.findOneBy(Usuario, {id: idUsuario});

        if(!usuario || !clase){
            return;
        }
        /////----ELIMINO LOS SOCIO-CLASES----////
        let a = await AppDataSource.manager
        .createQueryBuilder('socio_clase', 'socio_clase')
        .delete()
        .from(SocioClase)
        .where('socio_clase.claseId = :id', {id: idC})
        .execute();
        /////------ELIMINO LA CLASE------/////
        let q= 
        await AppDataSource.manager
        .createQueryBuilder('clase', 'clase')
        .delete()
        .from(Clase)
        .where('clase.id = :id', {id: idC})
        .execute();     
        res.json({
            data : "Clase eliminada"
        });


    }


    public static async validarEdicion(req : Request<any>, res : Response<any>) : Promise<void>{
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let usuarioId = tokenDecoded.id;
        let rolId = tokenDecoded.rol_id;
        let claseId = req.params.id;
        let clase = await AppDataSource.manager.findOne(Clase,{   
            where : {id: claseId},
            relations : { usuario : true}
        });

        if(rolId === 2 && clase?.usuario?.id !== usuarioId){
            res.status(409).json({
                message : "No puede editar una clase que no le pertenece"
            });
        }
        else{
            res.json({
                data : true
            });
        }
    }
}
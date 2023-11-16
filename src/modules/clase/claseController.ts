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

        options.where = {
            fecha: MoreThanOrEqual(new Date())
        };
        
        if (req.query.clase || req.query.profesor) {
            // Agregar condiciones adicionales si existen
            options.where.tipoClase = req.query.clase ? Like("%" + req.query.clase + "%") : undefined;
            options.where.usuario = req.query.profesor ? Like("%" + req.query.profesor + "%") : undefined;
        }

        let clases = await AppDataSource.getRepository(Clase).createQueryBuilder("clase").select(["clase.id","clase.fecha","clase.horario_inicio", "clase.horario_fin", "clase.tipoClaseId, usuarioId"])
        .leftJoinAndSelect("clase.tipoClase", "tipoClase")
        .leftJoinAndSelect("clase.usuario", "usuario")
        
        // Aplicar opciones de filtro si existen
        if (options.where) {
            clases = clases.where(options.where);
        }
        // Ejecutar la consulta
        const result = await clases.getMany();

        let clasesParseadas : any = result;

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

        if (clase.fecha <= new Date()) {
            console.log("imposible con esa fecha")
        }

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

    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void>{
        let idC = req.params.id;
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idUsuario = tokenDecoded.id;
        console.log("tokenDecoded: ",tokenDecoded)
        let rolIdUsuario = tokenDecoded.rol_id
        ///// VALIDAR EL Usuario /////
        let clase = await AppDataSource.manager.findOne(Clase, {where : {id: idC}, relations : {usuario : true, tipoClase : true}});
        let usuario =  await AppDataSource.manager.findOneBy(Usuario, {id: idUsuario});

        if(!usuario || !clase){
            return;
        }
        /////----ELIMINO LOS SOCIO-CLASES----////
        if(await this.validarUsuario(clase, usuario, rolIdUsuario)){
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
                    })
        }else{
            res.json({
                data : "ERR-NOAUTORIZADO"
                    })
        }

    }

    private static async validarUsuario(clase: Clase, usuario: Usuario, rolIdUsuario: Number ) : Promise<boolean>{
        ////// VALIDO EL USUARIO ////

        console.log("clase.usuario?.id ", clase.usuario?.id )
        console.log("usuario.id", usuario.id)
        console.log("rol", rolIdUsuario)

        if (rolIdUsuario === null) {
            return false;
        } else {
    
            if (rolIdUsuario === 1) {
                return true;
            }
            if (rolIdUsuario === 2) {
                // Verifica si clase.usuario?.id no es null y es un número antes de comparar
                return clase.usuario?.id === rolIdUsuario;
            }
        }
    
        return false
       
    }
}
import { AppDataSource      } from "../../data-source";
import { Clase              } from "../../entity/Clase";
import { AuthController     } from "../auth/AuthController";
import { Request            } from "express-serve-static-core";
import { Response           } from "express-serve-static-core";
import { SocioClase         } from "../../entity/SocioClase";
import { Usuario            } from "../../entity/Usuario";

export class MisClasesController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idSocio = tokenDecoded.id;
        
        let fechaHoy = (new Date()).toISOString().split("T")[0];

        let clases : any = await AppDataSource.manager.query(`
            SELECT clase.*, clase.horario_inicio as horario, CONCAT(usuario.nombre, " ", usuario.apellido) as profesor, tipo_clase.descripcion as clase, tipo_clase.cupo
            FROM clase
            INNER JOIN usuario ON clase.usuarioId = usuario.id
            INNER JOIN tipo_clase ON tipo_clase.id = clase.tipoClaseId
            WHERE clase.fecha >= '${fechaHoy}'
            ORDER BY clase.fecha ASC
        `);

        clases.forEach((element : any) => {
            element.fecha = element.fecha.toISOString().split("T")[0];
        });

        let clasesListado = [];

        for (let index = 0; index < clases.length; index++) {
            const element = clases[index];
            let inscripciones : any = (await AppDataSource.manager.query(`
            SELECT COUNT(*) as inscripciones
            FROM socio_clase
            WHERE socio_clase.claseId = '${element.id}'
            `))[0].inscripciones;
            clases[index].cupo = element.cupo - inscripciones

            let usuarioInscripto : any = (await AppDataSource.manager.query(`
            SELECT COUNT(*) as usuario_inscripto
            FROM socio_clase
            WHERE socio_clase.usuarioId = '${idSocio}' AND socio_clase.claseId = '${element.id}'
            `))[0].usuario_inscripto;
            clases[index].usuarioInscripto = usuarioInscripto === "1" ? true : false;
                        
            if(clases[index].cupo > 0){
                clasesListado.push(clases[index]);
            }
            else{
                if(clases[index].usuarioInscripto){
                    clasesListado.push(clases[index]);
                }
            }
            
        }

        res.json({
            data : clasesListado
        })
    }

    public static async inscribirse(req : Request<any>, res : Response<any>) : Promise<void> {
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idSocio = tokenDecoded.id;
        let socio = await AppDataSource.manager.findOneBy(Usuario,{id :idSocio});
        
        let clase = await AppDataSource.manager.findOne(Clase,{
            where : {
                id:req.params.idClase
            },
            relations : {
                tipoClase : true
            }
        });

        if(!socio || !clase){
            return;
        }

        let puedeInscribirse = await MisClasesController.validarPuedeInscribirse(socio,clase);

        if(puedeInscribirse === "Inscripto"){
            res.status(409).json({
                message : "Ya se encuentra inscripto en la clase"
            });
            return;
        }

        if(puedeInscribirse === "Superposicion"){
            res.status(409).json({
                message : "Ya se encuentra inscripto a otra clase en ese horario"
            });
            return;
        }

      
        let inscripcion = new SocioClase();
        inscripcion.asistencia = false;
        inscripcion.clase = clase;
        inscripcion.fecha_inscripcion = new Date();
        inscripcion.usuario = socio;

        inscripcion = await AppDataSource.manager.save(inscripcion);

        res.json({
            data : {
                clase       : clase,
                inscripcion : inscripcion
            }
        })    
    }

    private static async validarPuedeInscribirse(socio : Usuario, clase : Clase) : Promise<"" | "Inscripto" | "Superposicion"> {
        if((await this.validarPuedeCancelarInscripcion(socio, clase))){
            return "Inscripto";
        }

        let socioClases = await AppDataSource.manager.query(`
            SELECT socio_clase.*, clase.id as claseId, clase.fecha, clase.horario_inicio, clase.horario_fin
            FROM socio_clase
            INNER JOIN clase ON socio_clase.claseId = clase.id
            WHERE socio_clase.usuarioId = ${socio.id} 
            AND clase.fecha = '${clase.fecha}'
            AND (clase.horario_inicio BETWEEN '${clase.horario_inicio}' AND '${clase.horario_fin}'
            OR clase.horario_fin BETWEEN '19:36:12' AND '19:36:12')

        `);

        if(socioClases.length >0 ){
            return "Superposicion";
        }

        return "";
    }

    public static async cancelarInscripcion(req : Request<any>, res : Response<any>) : Promise<void> {
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idSocio = tokenDecoded.id;
        let socio = await AppDataSource.manager.findOneBy(Usuario,{id :idSocio});

        let clase = await AppDataSource.manager.findOne(Clase,{
            where : {
                id:req.params.idClase
            },
            relations : {
                tipoClase : true
            }
        });

        if(!socio || !clase){
            return;
        }

        let puedeCancelarInscripcion = await MisClasesController.validarPuedeCancelarInscripcion(socio, clase);
        if(!puedeCancelarInscripcion){
            res.status(409).json({
                message : "Error al eliminar la inscripcion"
            });
            return;
        }

        await AppDataSource.manager.query(`
            DELETE
            FROM socio_clase
            WHERE socio_clase.id = '${puedeCancelarInscripcion}'
        `);


        res.json({
            data : true
        })
    }

    private static async validarPuedeCancelarInscripcion(socio : Usuario, clase : Clase) : Promise<false | number> {
        let socioClase = await AppDataSource.manager.query(`
            SELECT socio_clase.*
            FROM socio_clase
            WHERE socio_clase.claseId = '${clase.id}' AND socio_clase.usuarioId = '${socio.id}'
        `);

        return socioClase.length > 0 ? socioClase[0].id : false;
    }

    

}


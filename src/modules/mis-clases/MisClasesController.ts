import { AppDataSource      } from "../../data-source";
import { Clase              } from "../../entity/Clase";
import { AuthController     } from "../auth/AuthController";
import { Request            } from "express-serve-static-core";
import { Response           } from "express-serve-static-core";

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
        let clase = await AppDataSource.manager.findOne(Clase,{
            where : {
                id:req.params.idClase
            },
            relations : {
                tipoClase : true
            }
        });
        
        if(
            //validar si no existe inscripcion para el soscio
            true
        ){
            //inscribo

            let inscripcion;
            res.json({
                data : {
                    clase : clase,
                    inscripcion : inscripcion
                }
            })
        }
        else{
            // respondo mensaje que no puede inscribirse
            res.json({
                data : "error"
            })
        }


        
    }

    public static async cancelarInscripcion(req : Request<any>, res : Response<any>) : Promise<void> {
        res.json({
            data : "cancelarInscripcion"
        })
    }

}
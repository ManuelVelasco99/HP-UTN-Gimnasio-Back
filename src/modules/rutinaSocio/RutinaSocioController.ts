import { AppDataSource      } from "../../data-source";
import { AuthController     } from "../auth/AuthController";
import { Ejercicio          } from "../../entity/Ejercicio";
import { Nota               } from "../../entity/Nota";
import { Request            } from "express-serve-static-core";
import { Response           } from "express-serve-static-core";
import { Rutina             } from "../../entity/Rutina";
import { TipoEjercicio } from "../../entity/TipoEjercicio";
export class RutinaSocioController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idSocio = tokenDecoded.id;

        let queryBuilder = AppDataSource.manager.createQueryBuilder(Rutina,"rutina");
        let rutinas = await queryBuilder
        .where(`rutina.socioId = ${idSocio}`)
        .orderBy("fecha_creacion", "DESC")
        .getMany();
        for (let index = 0; index < rutinas.length; index++) {
            const element = rutinas[index];
            let ejercicios : any = await AppDataSource.manager.query(`
                SELECT ejercicio.*, tipo_ejercicio.descripcion, tipo_ejercicio.nombre, tipo_ejercicio.multimedia
                FROM ejercicio
                INNER JOIN tipo_ejercicio ON tipo_ejercicio.id = ejercicio.tiposEjercicioId
                WHERE ejercicio.rutinaId = ${element.id}
            `);
            for(let i =0; i< ejercicios.length; i++){
                ejercicios[i].multimedia = generarLinkEnbebido(ejercicios[i].multimedia );
            }
            console.log(ejercicios)
            element.ejercicios = ejercicios;
            rutinas[index].ejercicios = ejercicios;
            for (let indexE = 0; indexE < ejercicios.length; indexE++) {
                if(!element.ejercicios){
                    break;
                }
                const elementE = element.ejercicios[indexE];
                let queryBuilder = AppDataSource.manager.createQueryBuilder(Nota, "nota");
                let notas = await queryBuilder
                .where(`nota.ejercicioId = ${elementE.id}`)
                .orderBy("id", "DESC")
                .getMany();
                element.ejercicios[indexE].notas = notas;
            }
        }


        res.json({
            data : rutinas
        })
    }

    public static async agregarNota(req : Request<any>, res : Response<any>) : Promise<void> {
        let ejercicio = await AppDataSource.manager.findOneBy(Ejercicio,{id:req.params.idEjercicio});
        if(!ejercicio){
            return;
        }

        let nota = new Nota();

        nota.comentario = req.body.comentario;
        nota.peso       = req.body.peso;
        nota.ejercicio  = ejercicio;
        nota.fecha      = new Date();

        nota = await AppDataSource.manager.save(nota);

        res.json({
            data : nota
        })
    }

}

function generarLinkEnbebido(link:string) : string {
    let nuevoLink : string =""
    if(link){
        for (let i = 0; i < link.indexOf("watch?v="); i++){
            nuevoLink += (link[i])
        }
        nuevoLink+="embed/";
        for (let i = (link.indexOf("watch?v=")+8); i <link.length ; i++){
            nuevoLink += (link[i])
        }
    }
    return nuevoLink
}
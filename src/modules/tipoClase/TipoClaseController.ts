import { AppDataSource   } from "../../data-source";
import { FindManyOptions } from "typeorm";
import { Like            } from "typeorm";
import { Request         } from "express-serve-static-core";
import { Response        } from "express-serve-static-core";
import { TipoClase       } from "../../entity/TipoClase";

export class TipoClaseController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {

        let options : FindManyOptions<TipoClase> = {}

        if(req.query.descripcion){
            options.where = {
                descripcion: Like("%"+req.query.descripcion+"%")
            }
        }

        let tiposClase = await AppDataSource.manager.find(TipoClase, options);

        res.json({
            data : tiposClase,
        })
    }

    public static async obtener(req : Request<any>, res : Response<any>) : Promise<void> {
        let tipoClaseId = req.params.id;
        let tipoClase   = await AppDataSource.manager.findOneBy(TipoClase,{ id: tipoClaseId });

        res.json({
            data : tipoClase
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tipoClase = new TipoClase();

        tipoClase.descripcion = req.body.descripcion;
        tipoClase.cupo        = req.body.cupo;

        tipoClase = await AppDataSource.manager.save(tipoClase);

        res.json({
            data : tipoClase
        })
    }

    public static async editar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tipoClaseId = req.params.id;
        let tipoClase = await AppDataSource.manager.findOneBy(TipoClase,{ id: tipoClaseId });
        if(!tipoClase){
            return;
        }

        tipoClase.descripcion = req.body.descripcion;
        tipoClase.cupo        = req.body.cupo;

        tipoClase = await AppDataSource.manager.save(tipoClase);

        res.json({
            data : tipoClase
        }) 
    }

    public static async reporte(req : Request<any>, res : Response<any>) : Promise<void>{
        let idTC = req.body.clase_id
        let fecha_desde = req.body.fecha_desde
        let fecha_hasta = req.body.fecha_hasta
        let horayprom  = await AppDataSource.manager.query(`
                                        select  cl.horario_inicio 'horario' , truncate( avg(ifnull(sc.asistencia, 0)*100) ,0) 'porcentaje' from clase cl
                                        left join socio_clase sc  on cl.id = sc.claseId
                                        where cl.fecha >= date('${fecha_desde}')-- fecha_desde 
                                        and cl.fecha <= date('${fecha_hasta}') -- fecha_hasta
                                        and cl.tipoClaseId = ${idTC} -- idTipoClase
                                        group by cl.horario_inicio;
                                `);   
        res.json({
            data : horayprom
        })
    }

    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tipoClaseId = req.params.id;
        let tipoClase = await AppDataSource.manager.findOneBy(TipoClase,{ id: tipoClaseId });
        if(!tipoClase){
            return;
        }

        let clases = await AppDataSource.manager.query(`
            SELECT *
            FROM clase
            WHERE clase.tipoClaseId = ${tipoClase.id}
        `);

        if(clases.length > 0) {
            res.status(409).json({
                message : "No se puede eliminar porque ya está asignado a una clase"
            });
            return;
        }

        let deletTipoClase = await AppDataSource.manager
            .createQueryBuilder('tipo_clase', 'tipo_clase')
            .delete()
            .from(TipoClase)
            .where('tipo_clase.id = :id', {id: tipoClase.id})
            .execute()
        ;

        res.json({
            data : true
        })
    }
}
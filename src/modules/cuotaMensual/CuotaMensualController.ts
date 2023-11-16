import { AppDataSource  } from "../../data-source";
import { CuotaMensual   } from "../../entity/CuotaMensual";
import { PrecioCuota    } from "../../entity/PrecioCuota";
import { Request        } from "express-serve-static-core";
import { Response       } from "express-serve-static-core";
import { Usuario        } from "../../entity/Usuario";
import { AuthController } from "../auth/AuthController";
import { MoreThanOrEqual } from "typeorm";
import { Rol } from "../../entity/Rol";

export class CuotaMensualController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let cuotaMensual = await AppDataSource.manager.find(CuotaMensual);

        res.json({
            data : cuotaMensual
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let cuotaMensual = new CuotaMensual();

        cuotaMensual.fecha_pago= new Date();

        let dniSocio = req.body.dni;
        
        let socio : Usuario | null = null;
        socio= await AppDataSource.manager.findOneBy(Usuario,{ dni: dniSocio });
        if(socio){
            cuotaMensual.socio=socio;
        }

        let idPrecioCuota =req.body.precio_cuota.id

        let precio_cuota : PrecioCuota | null = null;
        if(idPrecioCuota){
            precio_cuota= await AppDataSource.manager.findOneBy(PrecioCuota,{ id: idPrecioCuota });
            if(precio_cuota){
                cuotaMensual.precio_cuota=precio_cuota;
            }
        }

        res.json({
            data : "cuotaMensual"
        })

        return;

        cuotaMensual = await AppDataSource.manager.save(cuotaMensual);

        res.json({
            data : cuotaMensual
        })
    }

    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void> {
        let cuotaMensualId = req.params.id;
        let cuotaMensual = await AppDataSource.manager.findOneBy(CuotaMensual,{ id: cuotaMensualId });
        
        
        if(cuotaMensual){
            cuotaMensual.motivo_baja=req.params.motivo_baja;
            let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
            let usuarioEliminacion = await AuthController.obtenerDatosUsuarioPorId(tokenDecoded.id)
            if(usuarioEliminacion){
                cuotaMensual.usuario_eliminacion=usuarioEliminacion;
                cuotaMensual = await AppDataSource.manager.save(cuotaMensual);

                res.json({
                    data : cuotaMensual
                });
            }
            else{
                res.json({
                    error : "error"
                });
            }
        }
        //else{}

        
    }

    public static async validarPago(req : Request<any>, res : Response<any>) : Promise<void> {
        
        let dniSocio = req.body.dni;

        let socio : Usuario | null = null;



        try {
            const today = new Date();
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1; // Months start at 0!
            let dd = today.getDate();

            const formattedToday = yyyy+"-"+mm+"-"+dd;


            socio= await AppDataSource.manager.findOneBy(Usuario,{ dni: dniSocio });
            
            let socioRaw = await AppDataSource.manager
            .createQueryBuilder('usuario', 'u')
            .where('u.id = :id', {id: socio?.id})
            .getRawOne(); 
            //Busco el rol
            let rolUsuario=await AppDataSource.manager.findOneBy(Rol,{ id: socioRaw.u_rolId });

            if(rolUsuario?.nombre!="Socio"){
                res.status(409).json({
                    error : "Conflict: El DNI indicado es de un "+rolUsuario?.nombre
                });
                return;
            }

            let idPrecioCuota= await AppDataSource.manager
            .createQueryBuilder('precio_cuota','pc')
            .select('pc.id')
            .where("pc.fecha_desde<= :hoy", { hoy: formattedToday })
            .andWhere("pc.estado=1")
            .orderBy("pc.fecha_desde", "DESC")
            .limit(1)
            .getRawOne()

            let precio_cuota : PrecioCuota | null = null;
            if(idPrecioCuota){
                precio_cuota=await AppDataSource.manager.findOneBy(PrecioCuota,{ id: idPrecioCuota.pc_id });
            }

            if(socio && precio_cuota){
                res.json({
                    data : {
                        socio : socio,
                        precio_cuota : precio_cuota
                    }
                });
            }
            else{
                res.status(404).json({
                    error : "error"
                });
            }

            
        } catch (error) {
            res.status(404).json({
                error : "error"
            });
        }
    }

    public static async reportePagosCuota(req: Request<any>, res: Response<any>): Promise<void> {
        const fechaInicio = req.body.fechaInicio;
        const fechaFin = req.body.fechaFin;
        

        const countQuery = AppDataSource.manager.createQueryBuilder(CuotaMensual, "cuotaMensual")
            .where("cuotaMensual.fecha_pago BETWEEN :fechaInicio AND :fechaFin", { fechaInicio: fechaInicio, fechaFin: fechaFin })
            .getCount();

        const totalRegistros = await countQuery;

        const countPagadasQuery = AppDataSource.manager.createQueryBuilder(CuotaMensual, "cuotaMensual")
            .where("cuotaMensual.fecha_pago BETWEEN :fechaInicio AND :fechaFin", { fechaInicio: fechaInicio, fechaFin: fechaFin  })
            .andWhere("cuotaMensual.estado = :estado", { estado: true })
            .getCount();

        const totalPagadas = await countPagadasQuery;


        // Paso 1: Obtener los distintos precios de las cuotas.
        const preciosCuotas = await AppDataSource.manager.find(PrecioCuota, {
            select: ["id", "monto"],
            where: {
                fecha_desde: MoreThanOrEqual(fechaInicio), // Asegurarse de que estos nombres sean correctos según tu entidad PrecioCuota.
                estado: true
            }
        });

        // Paso 2: Utilizar los precios en la consulta principal.
        const queryBuilder = AppDataSource.manager.createQueryBuilder(CuotaMensual, "cuotaMensual")
            .select([
                `DATE_FORMAT(cuotaMensual.fecha_pago, '%Y-%m') AS mes`,
                `COUNT(*) AS totalRegistros`,
                `SUM(cuotaMensual.estado = 1) AS totalPagadas`,
                `SUM(precioCuota.monto) AS totalMontosBrutos`,
                `SUM(CASE WHEN cuotaMensual.estado = 1 THEN precioCuota.monto ELSE 0 END) AS totalMontosReal`
            ])
            .leftJoin("cuotaMensual.precio_cuota", "precioCuota")
            .where("cuotaMensual.fecha_pago BETWEEN :fechaInicio AND :fechaFin", { fechaInicio, fechaFin })
            .groupBy("mes")
            .orderBy("mes");

        // Agregar el filtro para los precios obtenidos.
        queryBuilder.andWhere("precioCuota.id IN (:...precios)", { precios: preciosCuotas.map(precio => precio.id) });

        // Obtener los resultados.
        const resultados = await queryBuilder.getRawMany();

        res.json({
            totalRegistros,
            totalPagadas,
            resultados,

        });
    }
    
}
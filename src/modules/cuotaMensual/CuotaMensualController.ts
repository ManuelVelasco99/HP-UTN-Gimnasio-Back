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
        let first = true;
        let textoWhere="";
        console.log("req.query.ocultar_eliminados: ",req.query.ocultar_eliminados)
        if(req.query.ocultar_eliminados){
            textoWhere = "WHERE cm.motivo_baja IS NULL";
            first = false;
        }
        if(req.query.nombre){
            if(!first){
                textoWhere = textoWhere + ` AND CONCAT(u.nombre, ' ', u.apellido) LIKE '%${req.query.nombre}%'`;
            }
            else{
                textoWhere =`WHERE CONCAT(u.nombre, ' ', u.apellido) LIKE '%${req.query.nombre}%'`;
                first = false;
            }
        }
        if(req.query.dni){
            if(!first){
                textoWhere = textoWhere + ` AND u.dni LIKE '%${req.query.dni}%'`;
            }
            else{
                textoWhere =`WHERE u.dni LIKE '%${req.query.dni}%'`;
                first = false;
            }
        }
        if(textoWhere){
            textoWhere= " " + textoWhere + " ";
        }
        let cuotaMensual : any = await AppDataSource.manager.query(`
            SELECT cm.id,u.dni,u.nombre,u.apellido,u.telefono,
            monthname(cm.fecha_periodo) "Mes Abonado",year(cm.fecha_periodo) "Año Abonado",
            pc.monto,cm.fecha_pago "Fecha Pago",cm.motivo_baja "Motivo Baja"
            FROM cuota_mensual cm
            inner join usuario u
            on cm.socioId=u.id
            inner join precio_cuota pc
            on cm.precioCuotaId=pc.id
            ${textoWhere}
        `)
        cuotaMensual.forEach((element: { [x: string]: { toLocaleDateString: () => any; }; }) => {
            element["Fecha Pago"]=element["Fecha Pago"].toLocaleDateString();
        });
        res.json({
            data : cuotaMensual
        })
    }
    
    public static async obtenerDatos(req : Request<any>, res : Response<any>) : Promise<void> {
        
        let idCuota = req.params.id;
        let datosCuota : any = await AppDataSource.manager.query(`
        SELECT u.dni,u.nombre,u.apellido,u.fecha_nacimiento,u.telefono,cm.fecha_periodo,pc.monto
        FROM cuota_mensual cm
        inner join usuario u
        on cm.socioId=u.id
        inner join precio_cuota pc
        on cm.precioCuotaId=pc.id
        where cm.id='${idCuota}'
        `);
        res.json({
            data : datosCuota
        });
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let cuotaMensual = new CuotaMensual();

        let dniSocio = req.body.dni;
        
        //Busco y guardo el socio
        let socio : Usuario | null = null;
        socio= await AppDataSource.manager.findOneBy(Usuario,{ dni: dniSocio });
        if(socio){
            cuotaMensual.socio=socio;
        }
        else{
            res.status(404).json({
                error : "error con el socio"
            })
            return;
        }

        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        const formattedToday = yyyy+"-"+mm+"-"+dd;

        //Busco y guardo el precio de la cuota
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
        
        if(precio_cuota){
            cuotaMensual.precio_cuota=precio_cuota;
        }
        else{
            res.status(404).json({
                error : "error con el precio cuota"
            })
            return;
        }

        //seteo datos de la cuota
        cuotaMensual.fecha_pago= new Date();
        cuotaMensual.estado=true;

        //busco la ultima cuota paga
        let periodoAnterior : any = await AppDataSource.manager.query(`
                SELECT cm.*
                FROM cuota_mensual cm
                INNER JOIN 
                    usuario u ON cm.socioId=u.id
                INNER JOIN 
                    precio_cuota pc ON cm.precioCuotaId=pc.id
                WHERE cm.motivo_baja IS NULL AND u.id = ${socio?.id}
                ORDER BY cm.fecha_periodo DESC
        `) 
        
        let periodoPago;
        if(periodoAnterior.length === 0){
            periodoPago = new Date();
        }
        else{                
            let fechaPeriodoAnterior = periodoAnterior[0].fecha_periodo.toISOString();
            fechaPeriodoAnterior = fechaPeriodoAnterior.split("T")[0];
            let arrayfechaPeriodoAnterior = fechaPeriodoAnterior.split("-");
            let mes = Number(arrayfechaPeriodoAnterior[1]); 
            let anio = Number(arrayfechaPeriodoAnterior[0]);
            if(mes === 12){
                periodoPago = new Date(`${anio+1}-01-02`);
            }
            else{
                periodoPago = new Date(`${anio}-${mes+1}-02`);
            }

        }

    
        cuotaMensual.fecha_periodo=periodoPago;

        cuotaMensual = await AppDataSource.manager.save(cuotaMensual);

        res.json({
            data : cuotaMensual
        })
    }

    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void> {
        let cuotaMensualId = req.params.id;
        let cuotaMensual = await AppDataSource.manager.findOneBy(CuotaMensual,{ id: cuotaMensualId });
        
        
        if(cuotaMensual){
            cuotaMensual.motivo_baja=req.body.motivo_baja;
            let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
            let usuarioEliminacion = await AuthController.obtenerDatosUsuarioPorId(tokenDecoded.id);
            cuotaMensual.estado=false;
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
                return;
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
            let periodoAnterior : any = await AppDataSource.manager.query(`
                SELECT cm.*
                FROM cuota_mensual cm
                INNER JOIN 
                    usuario u ON cm.socioId=u.id
                INNER JOIN 
                    precio_cuota pc ON cm.precioCuotaId=pc.id
                WHERE cm.motivo_baja IS NULL AND u.id = ${socio?.id}
                ORDER BY cm.fecha_periodo DESC
            `) 
            
            let periodoPago;
            if(periodoAnterior.length === 0){
                periodoPago = new Date();
            }
            else{                
                let fechaPeriodoAnterior = periodoAnterior[0].fecha_periodo.toISOString();
                fechaPeriodoAnterior = fechaPeriodoAnterior.split("T")[0];
                let arrayfechaPeriodoAnterior = fechaPeriodoAnterior.split("-");
                let mes = Number(arrayfechaPeriodoAnterior[1]); 
                let anio = Number(arrayfechaPeriodoAnterior[0]);
                if(mes === 12){
                    periodoPago = new Date(`${anio+1}-01-01`);
                }
                else{
                    periodoPago = new Date(`${anio}-${mes+1}-01`);
                }

            }
            
            let arrayfechaPeriodoAnterior = periodoPago.toISOString().split("-");
            let mes = Number(arrayfechaPeriodoAnterior[1]);


            function obtenerNombreMes(numero: number): string {
                switch (numero) {
                    case 1:
                        return "Enero";
                    case 2:
                        return "Febrero";
                    case 3:
                        return "Marzo";
                    case 4:
                        return "Abril";
                    case 5:
                        return "Mayo";
                    case 6:
                        return "Junio";
                    case 7:
                        return "Julio";
                    case 8:
                        return "Agosto";
                    case 9:
                        return "Septiembre";
                    case 10:
                        return "Octubre";
                    case 11:
                        return "Noviembre";
                    case 12:
                        return "Diciembre";
                    default:
                        return "Número de mes no válido. Por favor, ingresa un número del 1 al 12.";
                }
            }

            if(socio && precio_cuota){
                res.json({
                    data : {
                        socio : socio,
                        precio_cuota : precio_cuota,
                        periodoPago:obtenerNombreMes(mes)
                    }
                });
            }
            else{
                res.status(404).json({
                    error : "error"
                })
                return;
            }

            
        } catch (error) {
            res.status(404).json({
                error : "error"
            })
            return;
        }
    }

    public static async reportePagosCuota(req: Request<any>, res: Response<any>): Promise<void> {
        const fechaInicio = req.body.fecha_desde;
        const fechaFin = req.body.fecha_hasta;
        console.log("fechaInicio", fechaInicio)
        console.log("fechaFin", fechaFin)

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
        // queryBuilder.andWhere("precioCuota.id IN (:...precios)", { precios: preciosCuotas.map(precio => precio.id) });

        // Obtener los resultados.
        const resultados = await queryBuilder.getRawMany();

        res.json({
            totalRegistros,
            totalPagadas, 
            resultados,

        });
    }
    
}
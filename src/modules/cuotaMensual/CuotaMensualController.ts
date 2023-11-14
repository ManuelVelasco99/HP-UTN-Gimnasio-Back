import { AppDataSource  } from "../../data-source";
import { CuotaMensual   } from "../../entity/CuotaMensual";
import { PrecioCuota    } from "../../entity/PrecioCuota";
import { Request        } from "express-serve-static-core";
import { Response       } from "express-serve-static-core";
import { Usuario        } from "../../entity/Usuario";
import { AuthController } from "../auth/AuthController";

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

        let dniSocio = req.body.dniSocio;
        
        let socio : Usuario | null = null;
        socio= await AppDataSource.manager.findOneBy(Usuario,{ dni: dniSocio });
        if(socio){
            cuotaMensual.socio=socio;
        }

        let idPrecioCuota= await AppDataSource.manager
            .createQueryBuilder('precio_cuota','pc')
            .select('pc.id')
            .where("pc.fecha_desde< = :hoy", { hoy: new Date() })
            .orderBy("pc.fecha_desde", "DESC")
            .limit(1)
            .getRawOne()

        let precio_cuota : PrecioCuota | null = null;
        if(idPrecioCuota){
            precio_cuota= await AppDataSource.manager.findOneBy(PrecioCuota,{ id: idPrecioCuota });
            if(precio_cuota){
                cuotaMensual.precio_cuota=precio_cuota;
            }
        }
    
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
            
            let idPrecioCuota= await AppDataSource.manager
            .createQueryBuilder('precio_cuota','pc')
            .select('pc.id')
            .where("pc.fecha_desde<= :hoy", { hoy: formattedToday })
            //Falta validar el estado
            .orderBy("pc.fecha_desde", "DESC")
            .limit(1)
            .getRawOne()

            let precio_cuota : PrecioCuota | null = null;
            if(idPrecioCuota){
                precio_cuota=await AppDataSource.manager.findOneBy(PrecioCuota,{ id: idPrecioCuota.pc_id });
            }

            if(socio){
                res.json({
                    data : {
                        socio : socio,
                        precio_cuota : precio_cuota
                    }
                });
            }
            else{
                console.log("entro en el error");

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
}
import { AppDataSource   } from "../../data-source";
import { PrecioCuota     } from "../../entity/PrecioCuota";
import { Request         } from "express-serve-static-core";
import { Response        } from "express-serve-static-core";

export class PrecioCuotaController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let precioCuota : any = await AppDataSource.manager.query(`
            SELECT precio_cuota.id, precio_cuota.fecha_desde as 'Fecha desde', precio_cuota.monto
            FROM precio_cuota
            where precio_cuota.estado=1
            ORDER BY precio_cuota.fecha_desde DESC
        `);

        precioCuota.forEach((element : any) => {
            element["Fecha desde"] = element["Fecha desde"].toISOString().split("T")[0];
        });

        res.json({
            data : precioCuota
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let precioCuota = new PrecioCuota();

        precioCuota.monto = req.body.monto;
        precioCuota.fecha_desde = req.body.fecha_desde;
        precioCuota.estado = true;


        precioCuota = await AppDataSource.manager.save(precioCuota);

        res.json({
            data : precioCuota
        })
    }

    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void> {
        let precioCuota = await AppDataSource.manager.findOneBy(PrecioCuota,{id:req.params.id});
        if(!precioCuota){
            return;
        }
        precioCuota.estado = false;
        
        precioCuota = await AppDataSource.manager.save(precioCuota);

        res.json({
            data : precioCuota
        })
    }

}
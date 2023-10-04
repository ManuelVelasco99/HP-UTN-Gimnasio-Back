import { AppDataSource   } from "../../data-source";
import { PrecioCuota } from "../../entity/PrecioCuota";
import { Request         } from "express-serve-static-core";
import { Response        } from "express-serve-static-core";

export class PrecioCuotaController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let precioCuota = await AppDataSource.manager.find(PrecioCuota);

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

}
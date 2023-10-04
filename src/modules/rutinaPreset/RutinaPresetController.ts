import { AppDataSource   } from "../../data-source";
import { RutinaPreset } from "../../entity/RutinaPreset";
import { Request         } from "express-serve-static-core";
import { Response        } from "express-serve-static-core";

export class RutinaPresetController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let rutinasPresets = await AppDataSource.manager.find(RutinaPreset);

        res.json({
            data : rutinasPresets
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let rutinaPreset = new RutinaPreset();

        rutinaPreset.nombre = req.body.nombre;
        rutinaPreset.fecha_creacion      = req.body.fecha_creacion;

        rutinaPreset = await AppDataSource.manager.save(rutinaPreset);

        res.json({
            data : rutinaPreset
        })
    }
}
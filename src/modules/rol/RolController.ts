import { AppDataSource } from "../../data-source";
import { Rol           } from "../../entity/Rol";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";

export class RolController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let roles = await AppDataSource.manager.find(Rol);

        res.json({
            data : roles
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let rol = new Rol();

        rol.nombre = req.body.nombre;

        rol = await AppDataSource.manager.save(rol);

        res.json({
            data : rol
        })
    }
}
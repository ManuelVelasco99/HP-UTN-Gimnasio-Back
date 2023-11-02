import { AppDataSource   } from "../../data-source";
import { Request         } from "express-serve-static-core";
import { Response        } from "express-serve-static-core";
import { Usuario         } from "../../entity/Usuario";

export class SocioController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {

        let nombre_apellido = "";
        if(req.query.nombre_apellido){
            nombre_apellido = req.query.nombre_apellido.toString();
        }

        let queryBuilder = AppDataSource.manager.createQueryBuilder(Usuario,"usuario");

        const socios = await queryBuilder
        .where(`CONCAT(usuario.nombre, ' ', usuario.apellido) LIKE :nombre_apellido AND usuario.rolId = 4`, { nombre_apellido: `%${nombre_apellido}%` })
        .getMany();

        res.json({
            data : socios,
        });
    }


}
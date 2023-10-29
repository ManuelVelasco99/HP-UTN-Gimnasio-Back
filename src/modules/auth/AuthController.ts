import { AppDataSource } from "../../data-source";
import { Usuario       } from "../../entity/Usuario";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";
import   jwt             from "jsonwebtoken"; 

export class AuthController {

    public static async login(req : Request<any>, res : Response<any>) : Promise<void> {
        if(!req.body.dni){
            res.json({
                data : 'error'
            })
        }
        let usuario = await AppDataSource.manager.findOne(
            Usuario,
            {
                where :{
                    dni : req.body.dni,
                    contrasenia : req.body.contrasenia,
                    estado : true
                },
                relations : [
                    'rol'
                ]
            }
        );

        if(!usuario){
            res.status(403).json({
                data : 'Dni y/o contraseña incorrecto/s'
            })
        }
        let token = jwt.sign(
            {
                id : usuario?.id,
                nombre : usuario?.nombre,
                apellido : usuario?.apellido,
                rol_id : usuario?.rol?.id
            },
            process.env.SECRET_WORD || "?"
        )

        res.json({
            data : {
                token : token
            }
        })
    }

    public static async obtenerMisDatos(req : Request<any>, res : Response<any>) : Promise<void> {
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        
        let usuario = await AppDataSource.manager.findOne(
            Usuario,
            {
                where :{
                    id : tokenDecoded.id
                },
                relations : [
                    'rol'
                ]
            }
        );

        res.json({
            data: {
                nombre : usuario?.nombre,
                apellido : usuario?.apellido,
                telefono : usuario?.telefono,
                fecha_nacimiento : usuario?.fecha_nacimiento,
                email : usuario?.email,
                rol : usuario?.rol
            }
        })
    }

    private static async decodificarToken(token : string = '') : Promise<any> {
        return jwt.decode(token);
    }

    

}
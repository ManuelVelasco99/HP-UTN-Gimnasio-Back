import { AppDataSource     } from "../../data-source";
import { Request           } from "express-serve-static-core";
import { Response          } from "express-serve-static-core";
import { Rol               } from "../../entity/Rol";
import { Usuario           } from "../../entity/Usuario";
import { UsuarioController } from "../usuario/UsuarioController";

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

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {

        let socio = new Usuario;

        //TODO: Validar formato dni
        socio.dni = req.body.dni;
        let dniDisponible = await UsuarioController.validarDniDisponible(socio.dni);
        if(!dniDisponible){
            res.status(400).json({
                error : "El dni ingresado ya se encuentra en uso"
            
            });
            return;
        }

        
        socio.nombre   = req.body.nombre;
        socio.apellido = req.body.apellido;
        socio.fecha_nacimiento = req.body.fecha_nacimiento;
        socio.fecha_comienzo = new Date();
        socio.telefono = req.body.telefono;
        
        //TODO: Validar formato email
        socio.email = req.body.email;
        let emailDisponible = await UsuarioController.validarEmailDisponible(socio.email);
        if(!emailDisponible){
            res.status(400).json({
                error : "El email ingresado ya se encuentra en uso"
            
            });
            return;
        }
        
        //TODO: Agregar hasheado con bcrypt
        socio.contrasenia = req.body.contrasenia;
        //

        let rol = await AppDataSource.manager.findOneBy(Rol,{ id: 4 });

        socio.estado = true;

        socio.rol = rol;


        try {
            socio = await AppDataSource.manager.save(socio);
            //TODO: Dar de alta una cuota
            res.json({
                data : socio
            });
        } catch (error) {
            res.status(400).json({
                error : error
            });
        }
    }


}
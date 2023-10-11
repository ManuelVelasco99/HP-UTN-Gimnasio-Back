import { AppDataSource } from "../../data-source";
import { Usuario           } from "../../entity/Usuario";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";


export class UsuarioController {
    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let usuarios = await AppDataSource.manager.find(Usuario);

        res.json({
            data : usuarios
        })
    }
    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let usuario = new Usuario();
        let fechaHoy = new Date();
          usuario.contrasenia = req.body.contrasenia;    
          usuario.dni = req.body.dni;
          usuario.nombre = req.body.nombre;
          usuario.apellido = req.body.apellido;
          usuario.telefono = req.body.telefono;
          usuario.fecha_comienzo = fechaHoy;
          usuario.dni = req.body.dni;
          usuario.fecha_nacimiento = req.body.fecha_nacimiento;
          usuario.email = req.body.email;
          usuario.estado = true;
          usuario = await AppDataSource.manager.save(usuario);

        res.json({
            data : usuario
        })
    }





}
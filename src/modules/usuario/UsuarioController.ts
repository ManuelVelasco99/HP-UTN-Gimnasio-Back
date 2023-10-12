import { AppDataSource } from "../../data-source";
import { Usuario           } from "../../entity/Usuario";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";
import { Rol } from "../../entity/Rol";


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
        let idRol = req.body.idRol; 
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
          usuario.rol = await AppDataSource.manager.findOneBy(Rol, {id:idRol} )
          usuario = await AppDataSource.manager.save(usuario);
          
        res.json({
            data : usuario
        })
    }

    public static async editar(req :Request<any>, res: Response<any> ) : Promise <void>{
        let usuarioId = req.params.id;
        let usuario = await AppDataSource.manager.findOneBy(Usuario, {id : usuarioId});
        if(!usuario)
            {
                return;
            }
            usuario.dni = req.body.dni;
            usuario.nombre = req.body.nombre;
            usuario.apellido = req.body.apellido;
            usuario.telefono = req.body.telefono;
            
            usuario.dni = req.body.dni;
            usuario.fecha_nacimiento = req.body.fecha_nacimiento;
            usuario.email = req.body.email;
            
            usuario = await AppDataSource.manager.save(usuario);
            res.json
            (
                {
                    data:usuario
                }
            )

    }   





}
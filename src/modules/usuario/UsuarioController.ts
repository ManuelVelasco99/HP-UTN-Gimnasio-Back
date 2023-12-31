import { AppDataSource      } from "../../data-source";
import { Usuario            } from "../../entity/Usuario";
import { Request            } from "express-serve-static-core";
import { Response           } from "express-serve-static-core";
import { Rol                } from "../../entity/Rol";
import { createQueryBuilder } from "typeorm";


export class UsuarioController {
    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
       //let usuarios = await AppDataSource.manager.find(Usuario);
       
       try {
        let usuarios = await AppDataSource.manager
            
            .createQueryBuilder('usuario', 'u')
            .select('u.id, u.dni, u.nombre,u.apellido, u.telefono, date_format(u.fecha_nacimiento, "%Y-%m-%d")"fecha_nacimiento", date_format(u.fecha_comienzo, "%Y-%m-%d")"fecha_comienzo", u.email, r.nombre "rol"')
            .innerJoin('u.rol', 'r')
            .getRawMany();
            res.json({
                data : usuarios 
            })
       } catch (error) {
        res.json({data: "error"})
       }
        
    }
    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let usuario = new Usuario();
        let fechaHoy = new Date();
        let idRol = req.body.idRol; 
          usuario.contrasenia = req.body.contrasenia;    
          usuario.dni = req.body.dni;
          usuario.nombre = req.body.nombre;
          usuario.apellido = req.body.apellido;
          ///usuario.telefono = req.body.telefono;
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

    public static async obtenerDni(req : Request<any>, res : Response<any>) : Promise<void>{
        let socio = await AppDataSource.manager.findOneBy(Usuario, {dni: req.params.dni});
        //let socio = await AppDataSource.manager.findOneBy(SocioClase, {usuario: usu});
        console.log(socio);
        res.json({
            data : socio
        })
    }

    public static async obtener(req : Request<any>, res : Response<any>) : Promise<void> {
        let usuarioId = req.params.id;
        let usuario = await AppDataSource.manager.findOneBy(Usuario,{ id: usuarioId});

        res.json({
            data : usuario
        })
    }

    public static async validarDniDisponible(dni : string) : Promise<boolean> {
        let usuario = await AppDataSource.manager.findOneBy(Usuario,{ dni: dni });
        return usuario ? false : true;
    }

    public static async validarEmailDisponible(email : string) : Promise<boolean> {
        let usuario = await AppDataSource.manager.findOneBy(Usuario,{ email: email });
        return usuario ? false : true;
    }

}
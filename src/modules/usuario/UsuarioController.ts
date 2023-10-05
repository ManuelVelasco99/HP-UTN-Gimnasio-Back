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
       // precioCuota.monto = req.body.monto;
       // precioCuota.fecha_desde = req.body.fecha_desde;
       // precioCuota.estado = true;    
          usuario.dni = req.body.dni;
          usuario.nombre = req.body.nombre;
          usuario.apellido = req.body.apellido;
          usuario.telefono = req.body.telefono;
          usuario.fecha_comienzo = fechaHoy;
          usuario.dni = req.body.dni;


       // precioCuota = await AppDataSource.manager.save(precioCuota);

        res.json({
            data : usuario
        })
    }





}
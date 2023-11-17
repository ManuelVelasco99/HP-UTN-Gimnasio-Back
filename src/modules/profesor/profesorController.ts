import { AuthController    } from "../auth/AuthController";
import { AppDataSource     } from "../../data-source";
import { Request           } from "express-serve-static-core";
import { Response          } from "express-serve-static-core";
import { Rol               } from "../../entity/Rol";
import { Usuario           } from "../../entity/Usuario";
import { UsuarioController } from "../usuario/UsuarioController";

export class ProfesorController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        
        let nombre_apellido = "";
        if(req.query.nombre_apellido){
            nombre_apellido = req.query.nombre_apellido.toString();
        }

        let queryBuilder = AppDataSource.manager.createQueryBuilder(Usuario,"usuario");

        let profesores = await queryBuilder
        .where(`CONCAT(usuario.nombre, ' ', usuario.apellido) LIKE :nombre_apellido AND usuario.rolId = 2 and usuario.estado = true`, { nombre_apellido: `%${nombre_apellido}%` })
        .getMany();

        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let rolId = tokenDecoded.rol_id;

        if(rolId == 2){
            let profesoresFiltrados : Array<any> = [];
            profesores.forEach((element: any) => {
                if(element.id == tokenDecoded.id){
                    profesoresFiltrados.push(element);
                }
            });
            res.json({
                data : profesoresFiltrados,
            });
            return;
        }

        res.json({
            data : profesores,
        });
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {

        let profesor = new Usuario;

        //TODO: Validar formato dni
        profesor.dni = req.body.dni;
        let dniDisponible = await UsuarioController.validarDniDisponible(profesor.dni);
        if(!dniDisponible){
            res.status(409).json({
                dni : "El DNI ya está en uso"
            
            });
            return;
        }

        
        profesor.nombre   = req.body.nombre;
        profesor.apellido = req.body.apellido;
        profesor.fecha_nacimiento = req.body.fecha_nacimiento;
        profesor.fecha_comienzo = new Date();
        profesor.telefono = req.body.telefono;
        
        //TODO: Validar formato email
        profesor.email = req.body.email;
        let emailDisponible = await UsuarioController.validarEmailDisponible(profesor.email);
        if(!emailDisponible){
            res.status(409).json({
                email : "El email ya está en uso"
            
            });
            return;
        }
        
        //TODO: Agregar hasheado con bcrypt
        profesor.contrasenia = req.body.contrasenia;
        //

        let rol = await AppDataSource.manager.findOneBy(Rol,{ id: 2 });

        profesor.estado = true;

        profesor.rol = rol;


        try {
            profesor = await AppDataSource.manager.save(profesor);
            //TODO: Dar de alta una cuota
            res.json({
                data : profesor
            });
        } catch (error) {
            res.status(400).json({
                error : error
            });
        }
    }

    public static async obtener(req : Request<any>, res : Response<any>) : Promise<void> {
        let profesorId = req.params.id;
        let profesor = await AppDataSource.manager.findOneBy(Usuario,{ id: profesorId});

        res.json({
            data : profesor
        })
    }

    public static async actualizar(req : Request<any>, res : Response<any>) : Promise<void> {

        let profesor = new Usuario;
        //TODO: Validar formato dni
        profesor.id = req.body.id;
        profesor.dni = req.body.formValue.dni;
        let dniDisponible  = await AppDataSource.manager
        .createQueryBuilder('usuario', 'profe')
        .select('profe.dni')
        .where('profe.dni = :dni and profe.id != :id', {id:profesor.id, dni:profesor.dni})
        .getRawMany();
        if(dniDisponible.length>= 1){
            res.status(409).json({
                dni : "El DNI ya está en uso"
            
            });
            return;
        }

        
        profesor.nombre   = req.body.formValue.nombre;
        profesor.apellido = req.body.formValue.apellido;
        profesor.fecha_nacimiento = req.body.formValue.fecha_nacimiento;
        profesor.fecha_comienzo = req.body.formValue.fecha_comienzo;
        profesor.telefono = req.body.formValue.telefono;
        
        //TODO: Validar formato email
        profesor.email = req.body.formValue.email;
        
        
        // let emailDisponible = await UsuarioController.validarEmailDisponible(profesor.email);
        let emailDisponible = await AppDataSource.manager
        .createQueryBuilder('usuario', 'profe')
        .select('profe.email')
        .where('profe.email = :email and profe.id != :id', {id:profesor.id, email:profesor.email})
        .getRawMany();
        
        if(emailDisponible.length>=1){
            res.status(409).json({
                email : "El email ya está en uso"
            
            });
            return;
        }
        
        //TODO: Agregar hasheado con bcrypt
        profesor.contrasenia = req.body.formValue.contrasenia;
        //

        ////let rol = await AppDataSource.manager.findOneBy(Rol,{ id: 2 });

        ////profesor.estado = true;

        ////profesor.rol = rol;
        ///console.log("profesor", profesor)

        try {
            await AppDataSource.manager
            .createQueryBuilder()
            .update(Usuario)
            .set({
                nombre                	: profesor.nombre,
                apellido              	: profesor.apellido,
                fecha_nacimiento      	: profesor.fecha_nacimiento,
                telefono              	: profesor.telefono,
                email                 	: profesor.email,
                contrasenia           	: profesor.contrasenia,
            })
            .where("id = :id",{id: profesor.id})
            .execute();

            if(dniDisponible){
                await AppDataSource.manager
            .createQueryBuilder()
            .update(Usuario)
            .set({
                dni                   	: profesor.dni,
            })
            .where("id = :id",{id: profesor.id})
            .execute();
            }


            res.json({
                data : profesor
            });
        } catch (error) {
            res.status(400).json({
                error : error
            });
        }
    }

    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void>{
    let profesorId = req.params.id;
    await AppDataSource.manager
            .createQueryBuilder()
            .update(Usuario)
            .set({
                estado : false
            })
            .where("id = :id",{id: profesorId})
            .execute();
            res.json({
                data : "Eliminado con exito"
            });
    }

    public static async validarProfesorDadoDeBaja(req : Request<any>, res : Response<any>) : Promise<void>{
        let profesorDni = req.params.dni;
        let profesorDadoDeBaja = await AppDataSource.manager.query(`
            SELECT usuario.*
            FROM usuario
            WHERE usuario.dni = ${profesorDni} 
            AND usuario.rolId = 2
            AND usuario.estado = 0
        `);

        if(profesorDadoDeBaja.length > 0){
            let profesor = await AppDataSource.manager.findOneBy(Usuario,{ id: profesorDadoDeBaja[0].id });
            if(!profesor){
                return;
            }
            profesor.estado = true;
            profesor = await AppDataSource.manager.save(profesor);

            res.json({
                data : {
                    encontrado : true,
                    profesor : profesor
                }
            });
        }
        else{
            res.json({
                data : {
                    encontrado : false,
                }
            });
        }
    }
    
}
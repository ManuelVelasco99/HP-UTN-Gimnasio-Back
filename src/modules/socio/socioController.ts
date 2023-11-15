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
        .where(`CONCAT(usuario.nombre, ' ', usuario.apellido) LIKE :nombre_apellido AND usuario.rolId = 4 and usuario.estado = true`, { nombre_apellido: `%${nombre_apellido}%` })
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
    public static async actualizar(req : Request<any>, res : Response<any>) : Promise<void> {

        let socio = new Usuario;
        //TODO: Validar formato dni
        socio.id = req.body.id;
        socio.dni = req.body.formValue.dni;
        let dniDisponible  = await AppDataSource.manager
        .createQueryBuilder('usuario', 'socio')
        .select('socio.dni')
        .where('socio.dni = :dni and socio.id != :id', {id:socio.id, dni:socio.dni})
        .getRawMany();
        if(dniDisponible.length>= 1){
             res.status(400).json({
                 error : "El dni ingresado ya se encuentra en uso"

             });
             return;
         }

        
         socio.nombre   = req.body.formValue.nombre;
         socio.apellido = req.body.formValue.apellido;
         socio.fecha_nacimiento = req.body.formValue.fecha_nacimiento;
         socio.fecha_comienzo = req.body.formValue.fecha_comienzo;
         socio.telefono = req.body.formValue.telefono;
        
        //TODO: Validar formato email
        socio.email = req.body.formValue.email;
        
        
        // let emailDisponible = await UsuarioController.validarEmailDisponible(profesor.email);
        let emailDisponible = await AppDataSource.manager
        .createQueryBuilder('usuario', 'socio')
        .select('socio.email')
        .where('socio.email = :email and socio.id != :id', {id:socio.id, email:socio.email})
        .getRawMany();
        
        if(emailDisponible.length>=1){
            res.status(400).json({
                error : "El email ingresado ya se encuentra en uso"
            });
            return;
        }
        
        //TODO: Agregar hasheado con bcrypt
        socio.contrasenia = req.body.formValue.contrasenia;
        //

        ////let rol = await AppDataSource.manager.findOneBy(Rol,{ id: 2 });

        ////profesor.estado = true;

        ////profesor.rol = rol;
        ///console.log("profesor", socio)

        try {
            await AppDataSource.manager
            .createQueryBuilder()
            .update(Usuario)
            .set({
                nombre                	: socio.nombre,
                apellido              	: socio.apellido,
                fecha_nacimiento      	: socio.fecha_nacimiento,
                telefono              	: socio.telefono,
                email                 	: socio.email,
                contrasenia           	: socio.contrasenia,
            })
            .where("id = :id",{id: socio.id})
            .execute();

            if(dniDisponible){
                await AppDataSource.manager
            .createQueryBuilder()
            .update(Usuario)
            .set({
                dni                   	: socio.dni,
            })
            .where("id = :id",{id: socio.id})
            .execute();
            }


            res.json({
                data : socio
            });
        } catch (error) {
            res.status(400).json({
                error : error
            });
        }
    }
    
    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void>{
        let socioId = req.params.id;
        await AppDataSource.manager
                .createQueryBuilder()
                .update(Usuario)
                .set({
                    estado : false
                })
                .where("id = :id",{id: socioId})
                .execute();
        res.json({
            data : "Eliminado con exito"
        });
    }

    public static async obtener(req : Request<any>, res : Response<any>) : Promise<void> {
        let socioId  = req.params.id;
        let socio = await AppDataSource.manager.findOneBy(Usuario,{ id: socioId });

        res.json({
            data : socio
        })
    }



    public static async validarIngreso(req : Request<any>, res : Response<any>) : Promise<void> {
        let socioDNI = req.params.dni; /// cuotas_mensuales
        let socio = await AppDataSource.manager.findOne(Usuario,{ where:  {dni: socioDNI}, relations: {rol:true} });
        let fechaHoy  = new Date();
        let habilitado = false;

        let fechaUltimoPeriodoPago : any;
        if(!socio || socio.rol?.id !=4){
            res.json({
                data : ["No se encontró el socio", 3 ]
            })
        return
        }else{
            fechaUltimoPeriodoPago = await AppDataSource.manager.query(`
            SELECT max(cm.fecha_periodo)'fecha' FROM cuota_mensual cm where cm.socioId=${socio.id}`);
            if(!fechaUltimoPeriodoPago){ 
                res.json({
                    data : [ socio?.nombre + " " + socio?.apellido,2]
                })
                return
            }
        }
        let fechaSocio  = new Date(fechaUltimoPeriodoPago[0].fecha);


        //// Si el ultimo periodo de pago que tiene es igual al mes anterior al de hoy 
        if(fechaSocio.getMonth()+1 == fechaHoy.getMonth()  
        //// Y el año del ultimo periodo de pago es igual a este año
        && fechaSocio.getFullYear() == fechaHoy.getFullYear()
        //// Y Si hoy todavia no paso el día 15 del mes
        && fechaHoy.getDate() <= 15){
                habilitado = true;
        //// Si el mes del ultimo periodo pago es mayor o igual al mes actual
        }else if((fechaSocio.getMonth() >= fechaHoy.getMonth() 
        //// Y si el año es igual al año que corre
        && fechaSocio.getFullYear() == fechaHoy.getFullYear())
         //// O si el año del ultimo periodo de pago es mayor al año actual 
         //// (puede pasar que adelante cuotas del proximo año y sea el mes de ultimo periodo sea menor al actual)
        || fechaSocio.getFullYear()> fechaHoy.getFullYear())
        {
            habilitado = true; 
        }
        if(habilitado){
            res.json({
                data : ["",1]
            })
        }
        else{
            res.json({
                data : [ socio?.nombre + " " + socio?.apellido  ,2]
            })
        }
      
    }
}
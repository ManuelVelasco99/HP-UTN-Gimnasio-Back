import { AppDataSource } from "../../data-source";
import { Usuario       } from "../../entity/Usuario";
import { Request       } from "express-serve-static-core";
import { Response      } from "express-serve-static-core";
import   jwt             from "jsonwebtoken"; 
import keygen from "keygen";
import createTransport from "nodemailer";

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
        else{
            let expireOptions;
            if(req.body.recordarme){
                expireOptions = {};
            }
            else{
                expireOptions = {expiresIn:"4h"};
            }

            let token = jwt.sign(
                {
                    id : usuario?.id,
                    nombre : usuario?.nombre,
                    apellido : usuario?.apellido,
                    rol_id : usuario?.rol?.id
                },
                process.env.SECRET_WORD || "?",
                expireOptions
            )
    
            res.json({
                data : {
                    token : token
                }
            })
        }
        
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

    public static async olvideMiContrasenia(req : Request<any>, res : Response<any>) : Promise<void> {
        let email = req.body.email;
        let usuario = await AppDataSource.manager.findOneBy(Usuario,{email: email});
        if(usuario){
            console.log("usuario: ",usuario);
            let codigo =  keygen.hex(128);
            usuario.codigo_restablecimiento = codigo;
            usuario = await AppDataSource.manager.save(usuario);
            //envio de mail con el codigo 

            let transporter = createTransport.createTransport({
                service : "gmail",
                auth : {
                    user : "manuelvelascoutn@gmail.com",
                    pass : process.env.CLAVE_MAIL
                }
            });
            let url = process.env.APP_URL+"/auth/restablecer-contrasenia/"+codigo;
            let mailOptions = {
                from : "manuelvelascoutn@gmail.com",
                to: usuario.email,
                subject : "Restablecer contraseña - Sitema Gimnasio",
                text: `Hola ${usuario.nombre}, para restablecer su contraseña navegue al siguiente enlace ${url}`
            }
            await transporter.sendMail(mailOptions);
        }
        res.json({
            data: true
        })
    }

    public static async restablecerContrasenia(req : Request<any>, res : Response<any>) : Promise<void> {
        let contrasenia = req.body.constrasenia;
        let codigo_restablecimiento = req.body.codigo_restablecimiento;
        let usuario = await AppDataSource.manager.findOne(Usuario,{where:{codigo_restablecimiento:codigo_restablecimiento},
        relations:{rol:true}},);
        if(usuario){
            usuario.contrasenia = contrasenia;
            usuario.codigo_restablecimiento = null;
            usuario = await AppDataSource.manager.save(usuario);
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
        else{
            res.status(403).json({
                message: "Acceso denegado"
            });
        }
    }

    public static async decodificarToken(token : string = '') : Promise<any> {
        return jwt.decode(token);
    }

    public static async obtenerDatosUsuarioPorId(id : number){
        return await AppDataSource.manager.findOneBy(Usuario,{id: id});
    }

}
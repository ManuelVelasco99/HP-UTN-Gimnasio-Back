import { AppDataSource       } from "../../data-source";
import { Ejercicio           } from "../../entity/Ejercicio";
import { EjercicioController } from "../ejercicio/ejercicioController";
import { Request             } from "express-serve-static-core";
import { Response            } from "express-serve-static-core";
import { Rutina              } from "../../entity/Rutina";
import { Usuario             } from "../../entity/Usuario";
import { TipoEjercicio } from "../../entity/TipoEjercicio";
import { AuthController } from "../auth/AuthController";
import { FindManyOptions, Like } from "typeorm";

export class RutinaController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let nombreyap;
        if(!req.query.nombresocio){
            req.query.nombresocio="";
        }
    
         let rutinas = await AppDataSource.manager
        .createQueryBuilder('rutina', 'rut')
        .select(' rut.id"id", socio.nombre"nombre_socio", profe.nombre"nombre_profesor", date_format(rut.fecha_creacion, "%Y-%m-%d")"fecha_creacion", rut.nombre"nombre" ')
        .innerJoin('rut.socio', 'socio')
        .innerJoin('rut.profesor', 'profe')
        .where(`CONCAT(socio.nombre, ' ', socio.apellido) LIKE :nombre_apellido`, { nombre_apellido: "%"+req.query.nombresocio+"%" })
        .getRawMany();
        res.json({
            data : rutinas
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let rutina                          = new Rutina();
        let fechaHoy                        = new Date();
        let ejercicio; 
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idProfesor = tokenDecoded.id;
        rutina.profesor                     = await AppDataSource.manager.findOneBy(Usuario, {id : idProfesor});
        rutina.nombre                       = req.body.nombreRutina;
        rutina.socio                        = req.body.usuario;
        rutina.fecha_creacion               = fechaHoy; //Seba: le puse que cargue derecho la fecha del dia que se carga
        rutina = await AppDataSource.manager.save(rutina);

         for(let i = 0; i < req.body.ejercicios.length; i++ ){
            for(let j =0; j < req.body.ejercicios[i].length; j++){    
                ejercicio                   = new Ejercicio();     
                ejercicio.tiposEjercicio    = await AppDataSource.manager.findOneBy(TipoEjercicio, {id : req.body.ejercicios[i][j].id_tipo_ejercicio});
                ejercicio.rutina            = rutina;
                ejercicio.diaRutina         = req.body.ejercicios[i][j].diaRutina;
                ejercicio.series            = req.body.ejercicios[i][j].series;
                ejercicio.repeticiones      = req.body.ejercicios[i][j].repeticiones;
                ejercicio                   = await AppDataSource.manager.save(ejercicio);
            }
        }
        res.json({
                data : "Rutina cargada"
         })

    }
    private static async validarProfesor(rutina: Rutina, profesor: Usuario ) : Promise<boolean>{
        ////// VALIDO EL PROFE ////
        //console.log("Rutina", rutina)

        console.log("rutina.profesor?.id ", rutina.profesor?.id )
        console.log("profesor.id", profesor.id)
       return rutina.profesor?.id === profesor.id;
    }

    public static async obtener(req : Request<any>, res : Response<any>) : Promise<void> {
        //let rutinaPreset = await AppDataSource.manager.findOneBy(RutinaPreset, {id: req.params.dni});
        //let socio = await AppDataSource.manager.findOneBy(SocioClase, {usuario: usu});
        let idR = req.params.id;
        let rutina = await AppDataSource.manager
        .createQueryBuilder('rutina', 'r')
        .innerJoinAndSelect('r.ejercicios', 'ejercicios' )
        .innerJoin('r.socio', 'socio')
        .where('r.id = :id', {id: idR})
        .getRawMany(); 

        console.log(rutina);
        res.json({
            data : rutina
        })
    }

    public static async actualizar(req : Request<any>, res : Response<any>) : Promise<void> {
        let rutinaId                 = req.body.idRutina    ;
        let nombreRutina             = req.body.nombreRutina;
        let ejercicio; 
        let ejerciciosEditados      : Array <Ejercicio> = [];
        let ejerciciosActualizar    : Array <Ejercicio> = [];
        let ejerciciosBorrar        : Array <Ejercicio> = [];
        let ejercicioAgergar        : Array <Ejercicio> = [];
        let tokenDecoded            = await AuthController.decodificarToken(req.header('access-token'));
        let idProfesor              = tokenDecoded.id;
        ///// VALIDAR EL PROFESOR /////
        let profesor                = await AppDataSource.manager.findOneBy(Usuario, {id: idProfesor});
        let rutina                  = await AppDataSource.manager.findOne(Rutina,{where : {id: rutinaId}, relations : {ejercicios : true}});
        let runtina                 = await AppDataSource.manager.findOne(Rutina, {where : {id: rutinaId}, relations : {profesor : true}});

        if(!rutina ||!runtina || !rutina.ejercicios || !profesor){
            return;
        }
        if(await this.validarProfesor(runtina, profesor)){
            ///////////////////////////////////////////////////////////
            //// Asigno los ejercicios que vinieron a un arreglo  /////
            for(let i = 0; i < req.body.ejercicios.length; i++ ){
                for(let j =0; j < req.body.ejercicios[i].length; j++){    
                    ejercicio                   = new Ejercicio();     
                    ejercicio.id                = req.body.ejercicios[i][j].id;
                    ejercicio.tiposEjercicio    = await AppDataSource.manager.findOneBy(TipoEjercicio, {id : req.body.ejercicios[i][j].id_tipo_ejercicio});
                    ejercicio.rutina            = rutina;
                    ejercicio.diaRutina         = req.body.ejercicios[i][j].diaRutina;
                    ejercicio.series            = req.body.ejercicios[i][j].series;
                    ejercicio.repeticiones      = req.body.ejercicios[i][j].repeticiones;
                    ejerciciosEditados.push(ejercicio);
                }
            }
            ////                                                   ////
            ///////////////////////////////////////////////////////////

            ////////////////////////////////////////////////////////////////////////
            //// Guardo los ejercicios que vinieron y que estaban en la rutina /////
            for(let i=0; i < rutina.ejercicios?.length; i++ ){
                for(let j =0; j < ejerciciosEditados.length; j++){
                    if(rutina.ejercicios[i].id == ejerciciosEditados[j].id){
                        ejerciciosActualizar.push(ejerciciosEditados[j]);
                    }
                }
            }
            /////                                                              /////
            ////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //// Selecciono los ejercicios que no vinieron con el id que estaba en la rutina, por lo cual los guardo en un arreglo para borrarlos ////
            let borrar:boolean = true;
            for(let i=0; i < rutina.ejercicios?.length; i++){
                borrar = true;
                for(let j =0; j < ejerciciosEditados.length; j++){
                    if(rutina.ejercicios[i].id == ejerciciosEditados[j].id){
                    borrar=false
                    }
                }
                if(borrar){
                    ejerciciosBorrar.push(rutina.ejercicios[i]);
                }
            }
            /////                                                                                                                               //////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            ////////////////////////////////////////////////////////////////////////////////////////
            ///////// Selecciono los ejercicios que vienen sin id, son los que se agregan //////////
            for(let i = 0; i  < ejerciciosEditados.length; i++){
                if(ejerciciosEditados[i].id==undefined){
                    ejercicioAgergar.push(ejerciciosEditados[i]);
                }
            }
            ////                                                                                ////
            ////////////////////////////////////////////////////////////////////////////////////////

            ///////////////////////////////////////////////////////////////////////////////
            //// Una vez que ya tengo todo acomodado, lo actualizo en la base de datos ////
            ///////////////////////////////////////////////////////////////////////////////

            //// Actualizo ////

            await AppDataSource.manager
            .createQueryBuilder()
            .update(Rutina)
            .set({
                nombre : nombreRutina
            })
            .where("id = :id",{id: rutinaId})
            .execute();

            for(let i =0; i < ejerciciosActualizar.length; i++){
                AppDataSource.manager
                    .createQueryBuilder()
                    .update(Ejercicio)
                    .set(
                        {
                            diaRutina       : ejerciciosActualizar[i].diaRutina,
                            series          : ejerciciosActualizar[i].series,
                            repeticiones    : ejerciciosActualizar[i].repeticiones,
                            tiposEjercicio  : ejerciciosActualizar[i].tiposEjercicio 
                        }
                    )
                    .where("id = :id",{id: ejerciciosActualizar[i].id})
                    .execute();
            }

            //// Elimino ////
            for(let i = 0 ; i < ejerciciosBorrar.length; i++){
                AppDataSource.manager
                .createQueryBuilder('ejercicio', 'ejercicio')
                .delete()
                .from(Ejercicio)
                .where('ejercicio.id = :id', {id: ejerciciosBorrar[i].id})
                .execute();
                console.log("Borrando ando")
            }

            //// Agrego ////
            for(let i = 0 ; i < ejercicioAgergar.length; i++){
                await AppDataSource.manager.save(ejercicioAgergar[i]);
                console.log
            }
            console.log("actuyalizado")
            res.json({
                data : "Rutina actualizada"
                    })
        }else{
            res.json({
                data : "ERR-NOAUTORIZADO"
                    })
        
        }
    }




    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void>{
        let idR = req.params.id;
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idProfesor = tokenDecoded.id;
        ///// VALIDAR EL PROFESOR /////
        let runtina = await AppDataSource.manager.findOne(Rutina, {where : {id: idR}, relations : {profesor : true}});
        let profesor =  await AppDataSource.manager.findOneBy(Usuario, {id: idProfesor});

        if(!profesor || !runtina){
            return;
        }
        /////----ELIMINO LOS EJERCICIOS----////
        if(await this.validarProfesor(runtina, profesor)){
            let a = await AppDataSource.manager
            .createQueryBuilder('ejercicio', 'ejercicio')
            .delete()
            .from(Ejercicio)
            .where('ejercicio.rutinaId = :id', {id: idR})
            .execute();
            /////------ELIMINO LA RUTINA------/////
            let q= 
            await AppDataSource.manager
            .createQueryBuilder('rutina', 'rutina')
            .delete()
            .from(Rutina)
            .where('rutina.id = :id', {id: idR})
            .execute();     
            res.json({
                data : "Rutina eliminada"
                    })
        }else{
            res.json({
                data : "ERR-NOAUTORIZADO"
                    })
        }

    }

    public static async obtenerIdProfesor(token : string) {
        let tokenDecoded = await AuthController.decodificarToken(token);
    }

    
}
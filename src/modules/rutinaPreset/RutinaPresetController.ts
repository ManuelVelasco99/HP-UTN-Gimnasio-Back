import { promises } from "dns";
import { AppDataSource      } from "../../data-source";
import { RutinaPreset       } from "../../entity/RutinaPreset";
import { Request            } from "express-serve-static-core";
import { Response           } from "express-serve-static-core";
import { Ejercicio          } from "../../entity/Ejercicio";
import { TipoEjercicio      } from "../../entity/TipoEjercicio";
import { Usuario            } from "../../entity/Usuario"; 
import { AuthController } from "../auth/AuthController";

export class RutinaPresetController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        //let rutinasPresets = await AppDataSource.manager.find(RutinaPreset);
        let rutinasPreset = await AppDataSource.manager
        .createQueryBuilder('rutina_preset', 'rp')
        .select('rp.id, rp.nombre, ("----")"nombre_socio", ("----")"nombre_profesor", date_format(rp.fecha_creacion, "%Y-%m-%d")"fecha_creacion"')
        .getRawMany();        
        res.json({
            data : rutinasPreset
        })
    }
    public static async obtener(req : Request<any>, res : Response<any>) : Promise<void> {
        //let rutinaPreset = await AppDataSource.manager.findOneBy(RutinaPreset, {id: req.params.dni});
        //let socio = await AppDataSource.manager.findOneBy(SocioClase, {usuario: usu});
        let idR = req.params.id;
        let rutinaPreset = await AppDataSource.manager
        .createQueryBuilder('rutina_preset', 'rp')
        .innerJoinAndSelect('rp.ejercicio', 'ejercicios' )
        .where('rp.id = :id', {id: idR})
        .getRawMany(); 
        //.innerJoin('rut.socio', 'socio') . where("user.id = :id", { id: 1 })
        console.log(rutinaPreset);
        res.json({
            data : rutinaPreset
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let rutinaPreset = new RutinaPreset();
        let fechaHoy = new Date();
        let ejercicio; 
         rutinaPreset.nombre = req.body.nombreRutina;
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idProfesor = tokenDecoded.id;
        rutinaPreset.profesor                     = await AppDataSource.manager.findOneBy(Usuario, {id : idProfesor});
        rutinaPreset.fecha_creacion = fechaHoy; //Seba: le puse que cargue derecho la fecha del dia que se carga
        rutinaPreset = await AppDataSource.manager.save(rutinaPreset);

         for(let i = 0; i < req.body.ejercicios.length; i++ ){
            for(let j =0; j < req.body.ejercicios[i].length; j++){    
                ejercicio = new Ejercicio();     
                ejercicio.tiposEjercicio    = await AppDataSource.manager.findOneBy(TipoEjercicio, {id : req.body.ejercicios[i][j].id_tipo_ejercicio});
                ejercicio.rutinaPreset      = rutinaPreset;
                ejercicio.diaRutina         = req.body.ejercicios[i][j].diaRutina;
                ejercicio.series            = req.body.ejercicios[i][j].series;
                ejercicio.repeticiones      = req.body.ejercicios[i][j].repeticiones;
                ejercicio                   = await AppDataSource.manager.save(ejercicio);
            }
        }
        res.json({
                data : "Rutina preset cargada"
         })
    }
    private static async validarProfesor(rutinaPreset: RutinaPreset, profesor: Usuario ) : Promise<boolean>{
        ////// VALIDO EL PROFE ////
       return rutinaPreset.profesor?.id === profesor.id;
    }
    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void>{
        let idRP = req.params.id;
        let tokenDecoded = await AuthController.decodificarToken(req.header('access-token'));
        let idProfesor = tokenDecoded.id;
        ///// VALIDAR EL PROFESOR /////
        let runtinaPreset = await AppDataSource.manager.findOne(RutinaPreset, {where : {id: idRP}, relations : {profesor : true}});
        let profesor =  await AppDataSource.manager.findOneBy(Usuario, {id: idProfesor});

        if(!profesor || !runtinaPreset){
            return;
        }
        if(await this.validarProfesor(runtinaPreset, profesor)){
            /////----ELIMINO LOS EJERCICIOS----////
            let a = await AppDataSource.manager
            .createQueryBuilder('ejercicio', 'ejercicio')
            .delete()
            .from(Ejercicio)
            .where('ejercicio.rutinaPresetId = :id', {id: idRP})
            .execute();
            /////------ELIMINO LA RUTINA------/////
            let q= 
            await AppDataSource.manager
            .createQueryBuilder('rutina_preset', 'rutina_preset')
            .delete()
            .from(RutinaPreset)
            .where('rutina_preset.id = :id', {id: idRP})
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
        let rutina                  = await AppDataSource.manager.findOne(RutinaPreset,{where : {id: rutinaId}, relations : {ejercicio : true}});
        let runtina                 = await AppDataSource.manager.findOne(RutinaPreset, {where : {id: rutinaId}, relations : {profesor : true}});

        if(!rutina ||!runtina || !rutina.ejercicio || !profesor){
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
                    ejercicio.rutinaPreset           = rutina;
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
            for(let i=0; i < rutina.ejercicio?.length; i++ ){
                for(let j =0; j < ejerciciosEditados.length; j++){
                    if(rutina.ejercicio[i].id == ejerciciosEditados[j].id){
                        ejerciciosActualizar.push(ejerciciosEditados[j]);
                    }
                }
            }
            /////                                                              /////
            ////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //// Selecciono los ejercicios que no vinieron con el id que estaba en la rutina, por lo cual los guardo en un arreglo para borrarlos ////
            let borrar:boolean = true;
            for(let i=0; i < rutina.ejercicio?.length; i++){
                borrar = true;
                for(let j =0; j < ejerciciosEditados.length; j++){
                    if(rutina.ejercicio[i].id == ejerciciosEditados[j].id){
                    borrar=false
                    }
                }
                if(borrar){
                    ejerciciosBorrar.push(rutina.ejercicio[i]);
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
            .update(RutinaPreset)
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


}
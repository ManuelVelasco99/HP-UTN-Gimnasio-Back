import { AppDataSource   } from "../../data-source";
import { MaquinaElemento } from "../../entity/MaquinaElemento";
import { Request         } from "express-serve-static-core";
import { Response        } from "express-serve-static-core";
import { TipoEjercicio   } from "../../entity/TipoEjercicio";

export class TipoEjercicioController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tiposEjercicio = await AppDataSource.manager.find(TipoEjercicio);
        for(let i =0; i<tiposEjercicio.length; i++){
            tiposEjercicio[i].multimedia = generarLinkEnbebido(tiposEjercicio[i].multimedia);
        }
        
        res.json({
            data : tiposEjercicio 
        })
    }

    public static async obtener(req : Request<any>, res : Response<any>) : Promise<void> {
        let tipoEjercicioId = req.params.id;
        ////findOne(RutinaPreset, {where : {id: idRP}, relations : {profesor : true}});
        let tipoEjercicio = await AppDataSource.manager.findOne(TipoEjercicio,{ where : {id: tipoEjercicioId} , relations : {maquinaElemento : true} });
        res.json({
            data : tipoEjercicio
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {        
        let tipoEjercicio = new TipoEjercicio();
        tipoEjercicio.descripcion = req.body.descripcion;
        tipoEjercicio.nombre = req.body.nombre;
        tipoEjercicio.multimedia = req.body.multimedia;
        let maquiElementoId = req.body.idMaquinaElemento;
        let maquinaElemento : MaquinaElemento | null = null;
        if(maquiElementoId){
            maquinaElemento = await AppDataSource.manager.findOneBy(MaquinaElemento,{ id: maquiElementoId });
        }
        /*
        if(!maquinaElemento){
            return;
        }
        maquinaElemento.estado=true;
        maquinaElemento = await AppDataSource.manager.save(maquinaElemento);
        */
        tipoEjercicio.maquinaElemento = maquinaElemento;

        tipoEjercicio = await AppDataSource.manager.save(tipoEjercicio);
        console.log("Tipo Ejercicio cargado: " , tipoEjercicio)
        res.json({
            data : tipoEjercicio
        })
    }

    public static async editar(req : Request<any>, res : Response<any>) : Promise<void> {
        let tipoEjercicioId = req.params.id;
        let tipoEjercicio = await AppDataSource.manager.findOneBy(TipoEjercicio,{ id: tipoEjercicioId });
        if(!tipoEjercicio){
            return;
        }
        tipoEjercicio.nombre = req.body?.nombre;
        tipoEjercicio.descripcion = req.body.descripcion;
        tipoEjercicio.multimedia = req.body.multimedia;
        ///busco la id de maquinaElemento del tipo ejercicio
        let maquinaElementoId = req.body.idMaquinaElemento
        let maquinaElemento : MaquinaElemento | null = null;
        if(maquinaElementoId){
            maquinaElemento = await AppDataSource.manager.findOneBy(MaquinaElemento,{ id: maquinaElementoId });
        }
        tipoEjercicio.maquinaElemento = maquinaElemento;

        tipoEjercicio = await AppDataSource.manager.save(tipoEjercicio);

        res.json({
            data : tipoEjercicio
        })
    }
    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void>{
        let tipoEjercicioId = req.params.id;
        let tipoEjercicio = await AppDataSource.manager.findOne(TipoEjercicio,{ where : {id: tipoEjercicioId} , relations : {ejercicio : true} });
        
        if(tipoEjercicio?.ejercicio?.length){
            console.log("por mas que sea 0 entra")
            if(tipoEjercicio.ejercicio.length >0){
                res.json({
                    data : "¡No puede borrar el tipo de ejercicio porque tiene ejercicios asignados!"
                })
            }
        }else{
            let a = await AppDataSource.manager
            .createQueryBuilder('tipo_ejercicio', 'tipo_ejercicio')
            .delete()
            .from(TipoEjercicio)
            .where('tipo_ejercicio.id = :id', {id: tipoEjercicioId})
            .execute();
            res.json({
                data : "Eliminado con exito"
            })
        }
    }

    

}
function generarLinkEnbebido(link:string) : string {
    let nuevoLink : string =""
    if(link){
        for (let i = 0; i < link.indexOf("watch?v="); i++){
            nuevoLink += (link[i])
        }
        nuevoLink+="embed/";
        for (let i = (link.indexOf("watch?v=")+8); i <link.length ; i++){
            nuevoLink += (link[i])
        }
    }
    return nuevoLink
}
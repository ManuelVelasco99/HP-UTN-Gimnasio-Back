import { AppDataSource   } from "../../data-source";
import { MaquinaElemento } from "../../entity/MaquinaElemento";
import { Request         } from "express-serve-static-core";
import { Response        } from "express-serve-static-core";

export class MaquinaElementoController {

    public static async listar(req : Request<any>, res : Response<any>) : Promise<void> {
        let maquinasElementos = await AppDataSource.manager.find(MaquinaElemento);

        res.json({
            data : maquinasElementos
        })
    }

    public static async obtener(req : Request<any>, res : Response<any>) : Promise<void> {
        let maquinaElementoId = req.params.id;
        let maquinaElemento = await AppDataSource.manager.findOneBy(MaquinaElemento,{ id: maquinaElementoId });

        res.json({
            data : maquinaElemento
        })
    }

    public static async agregar(req : Request<any>, res : Response<any>) : Promise<void> {
        let maquinaElemento = new MaquinaElemento();

        maquinaElemento.descripcion = req.body.descripcion;
        maquinaElemento.estado      = true;

        maquinaElemento = await AppDataSource.manager.save(maquinaElemento);

        res.json({
            data : maquinaElemento
        })
    }

    public static async editar(req : Request<any>, res : Response<any>) : Promise<void> {
        let maquinaElementoId = req.params.id;
        let maquinaElemento = await AppDataSource.manager.findOneBy(MaquinaElemento,{ id: maquinaElementoId });
        if(!maquinaElemento){
            return;
        }

        maquinaElemento.descripcion = req.body.descripcion;

        maquinaElemento = await AppDataSource.manager.save(maquinaElemento);

        res.json({
            data : maquinaElemento
        })
    }

    public static async eliminar(req : Request<any>, res : Response<any>) : Promise<void> {
        let maquinaElementoId = req.params.id;
        let maquinaElemento = await AppDataSource.manager.findOne(MaquinaElemento,{ where: {id: maquinaElementoId}, relations :{tiposEjercicio:true} });
        if(!maquinaElemento){
            return;
        }
        if(!maquinaElemento.tiposEjercicio)
        {
            return;
        }
        if(maquinaElemento.tiposEjercicio.length>0){
            res.json({
                data : "No se puede eliminar la maquina o elemento porque tiene tipos de ejercicios asociados"
            });
        }
        else{
            console.log("ejercicios asociados largo: ", maquinaElemento.tiposEjercicio?.length)
            let a = await AppDataSource.manager
            .createQueryBuilder('maquina_elemento', 'maquina_elemento')
            .delete()
            .from(MaquinaElemento)
            .where('maquina_elemento.id = :id', {id: maquinaElementoId})
            .execute();
            res.json({
                data : "Eliminado conexito"
            });
        }       
    }

} 
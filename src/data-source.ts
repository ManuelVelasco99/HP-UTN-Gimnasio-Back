import "reflect-metadata"
import { DataSource      } from "typeorm"
import   dotenv            from 'dotenv';
import { MaquinaElemento } from "./entity/MaquinaElemento"
import { Rol             } from "./entity/Rol";
import { TipoClase       } from "./entity/TipoClase";
import { Clase           } from "./entity/Clase";
import { CuotaMensual    } from "./entity/CuotaMensual";
import { SocioClase      } from "./entity/SocioClase";
import { TipoEjercicio   } from "./entity/TipoEjercicio";
import { Usuario         } from "./entity/Usuario";
import { Rutina          } from "./entity/Rutina";
import { RutinaPreset    } from "./entity/RutinaPreset";
import { PrecioCuota     } from "./entity/PrecioCuota";
import { Nota            } from "./entity/Nota";
import { Ejercicio       } from "./entity/Ejercicio";


dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [
        MaquinaElemento,
        Rol,
        TipoClase,
        Clase,
        CuotaMensual,
        SocioClase,
        TipoEjercicio,
        Usuario,
        Rutina,
        RutinaPreset,
        PrecioCuota,
        Nota,
        Ejercicio,
    ],
    subscribers: [],
    migrations: [],
})

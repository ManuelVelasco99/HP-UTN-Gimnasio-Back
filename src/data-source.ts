import "reflect-metadata"
import { DataSource      } from "typeorm"
import   dotenv            from 'dotenv';
import { MaquinaElemento } from "./entity/MaquinaElemento"
import { Rol             } from "./entity/Rol";
import { TipoClase       } from "./entity/TipoClase";
import { TipoEjercicio   } from "./entity/TipoEjercicio";
import { Usuario } from "./entity/Usuario";
import { RutinaPreset } from "./entity/RutinaPreset";
import { PrecioCuota } from "./entity/PrecioCuota";
import { Nota            } from "./entity/Nota";


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
        TipoEjercicio,
        Usuario,
        RutinaPreset,
        PrecioCuota,
        Nota,
    ],
    subscribers: [],
    migrations: [],
})

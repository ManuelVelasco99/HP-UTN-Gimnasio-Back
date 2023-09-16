import "reflect-metadata"
import { DataSource      } from "typeorm"
import   dotenv            from 'dotenv';
import { MaquinaElemento } from "./entity/MaquinaElemento"
import { Rol             } from "./entity/Rol";
import { TipoClase       } from "./entity/TipoClase";

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
        TipoClase
    ],
    subscribers: [],
    migrations: [],
})

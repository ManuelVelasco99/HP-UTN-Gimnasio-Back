import "reflect-metadata"
import { DataSource      } from "typeorm"
import   dotenv            from 'dotenv';
import { MaquinaElemento } from "./entity/MaquinaElemento"

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
    entities: [MaquinaElemento],
    subscribers: [],
    migrations: [],
})

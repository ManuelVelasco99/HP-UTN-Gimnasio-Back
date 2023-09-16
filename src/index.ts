import { AppDataSource         } from "./data-source"
import   dotenv                  from 'dotenv';
import   express                 from 'express';
import { Express               } from 'express';
import { maquinaElementoRouter } from "./modules/maquinaElemento/maquinaElementoRouter";
import { Request               } from 'express';
import { Response              } from 'express';
import { rolRouter             } from "./modules/rol/rolRouter";
import { tipoclaseRouter       } from "./modules/tipoClase/tipoclaseRouter";


dotenv.config();
const app: Express = express();
app.use(express.urlencoded());
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.json({data:'Express + TypeScript Server'});
});

//RUTAS
app.use('/maquina-elemento', maquinaElementoRouter);
app.use('/rol', rolRouter);
app.use('/tipo-clase', tipoclaseRouter);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

AppDataSource.initialize();
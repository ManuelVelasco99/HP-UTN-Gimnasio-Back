import { AppDataSource         } from "./data-source"
import   dotenv                  from 'dotenv';
import   express                 from 'express';
import { Express               } from 'express';
import { maquinaElementoRouter } from "./modules/maquinaElemento/maquinaElementoRouter";
import { Request               } from 'express';
import { Response              } from 'express';
import { rolRouter             } from "./modules/rol/rolRouter";
import { tipoclaseRouter       } from "./modules/tipoClase/tipoclaseRouter";
import { tipoEjercicioRouter   } from "./modules/tipoEjercicio/tipoEjercicioRouter";
import { usuarioRouter         } from "./modules/usuario/usuarioRouter";
import { rutinaRouter          } from "./modules/rutina/rutinaRouter";
import { rutinaPresetRouter    } from "./modules/rutinaPreset/rutinaPresetRouter";
import bodyParser from "body-parser";



dotenv.config();
const app: Express = express();
app.use(express.urlencoded());
const port = process.env.PORT;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.get('/', (req: Request, res: Response) => {
    res.json({data:'Express + TypeScript Server'});
});

//RUTAS
app.use('/maquina-elemento', maquinaElementoRouter);
app.use('/rol', rolRouter);
app.use('/tipo-clase', tipoclaseRouter);
app.use('/tipo-ejercicio', tipoEjercicioRouter);
app.use('/usuario', usuarioRouter);
app.use('/rutina', rutinaRouter);
app.use('/rutinaPreset', rutinaPresetRouter);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

AppDataSource.initialize();
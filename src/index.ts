import { AppDataSource         } from "./data-source"
import { authRouter            } from "./modules/auth/authRouter";
import   bodyParser              from "body-parser";
import { claseRouter           } from "./modules/clase/claseRouter";
import { cuotaMensualRouter    } from "./modules/cuotaMensual/cuotaMensualRouter";
import   cors                    from 'cors';
import   dotenv                  from 'dotenv';
import   express                 from 'express';
import { Express               } from 'express';
import { maquinaElementoRouter } from "./modules/maquinaElemento/maquinaElementoRouter";
import { Middlewares           } from "./middlewares/verifyToken";
import { misClasesRouter       } from "./modules/mis-clases/misClasesRouter";
import { precioCuotaRouter     } from "./modules/precioCuota/precioCuotaRouter";
import { Request               } from 'express';
import { Response              } from 'express';
import { rolRouter             } from "./modules/rol/rolRouter";
import { rutinaPresetRouter    } from "./modules/rutinaPreset/rutinaPresetRouter";
import { rutinaRouter          } from "./modules/rutina/rutinaRouter";
import { rutinaSocioRouter     } from "./modules/rutinaSocio/rutinaSocioRouter";
import { socioClaseRouter      } from "./modules/socioClase/socioClaseRouter";
import { socioRouter           } from "./modules/socio/socioRouter";
import { tipoEjercicioRouter   } from "./modules/tipoEjercicio/tipoEjercicioRouter";
import { tipoclaseRouter       } from "./modules/tipoClase/tipoclaseRouter";
import { usuarioRouter         } from "./modules/usuario/usuarioRouter";
import { profesorRouter } from "./modules/profesor/profesorRouter";


dotenv.config();
const app: Express = express();
app.use(express.urlencoded());
const port = process.env.PORT;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
//app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({data:'Express + TypeScript Server'});
});

//RUTAS
app.use('/auth'            , authRouter            );
app.use('/clase'           , claseRouter           );
app.use('/cuota'   , cuotaMensualRouter    );
app.use('/maquina-elemento', maquinaElementoRouter );
app.use('/maquina-elemento',
    [
        Middlewares.verifyToken,
        Middlewares.validarRolDelEncargado
    ],
    maquinaElementoRouter
);
app.use('/mis-clases',
    [
        Middlewares.verifyToken,
    ],
    misClasesRouter
);
app.use('/precio-cuota'    , precioCuotaRouter     );
app.use('/rutinaPreset',
    [
        Middlewares.verifyToken,
        Middlewares.validarRolDelProfesorOEncargado
    ],
    rutinaPresetRouter
);
app.use('/rutina',
    [
        Middlewares.verifyToken,
        Middlewares.validarRolDelProfesorOEncargado
    ],
    rutinaRouter
);
app.use('/rutina-socio',
    [
        Middlewares.verifyToken,
        Middlewares.validarRolDelSocio
    ],
    rutinaSocioRouter
);
app.use('/rol'             , rolRouter             );
app.use('/socio',
    [
        Middlewares.verifyToken,
        Middlewares.validarRolDelEncargado
    ],
    socioRouter
);

app.use('/profesor',
    [
        Middlewares.verifyToken,
    ],
    profesorRouter
);

app.use('/socio-clase'     , socioClaseRouter      );
app.use('/tipo-clase',
    [
        Middlewares.verifyToken,
    ],
    tipoclaseRouter
);
app.use('/tipo-ejercicio'  , tipoEjercicioRouter   );
app.use('/usuario'         , usuarioRouter         );

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

AppDataSource.initialize();
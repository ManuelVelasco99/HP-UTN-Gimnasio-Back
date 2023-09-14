import   dotenv                  from 'dotenv';
import   express                 from 'express';
import { Express               } from 'express';
import { maquinaElementoRouter } from './modules/MaquinaElemento/maquinaElementoRouter';
import { Request               } from 'express';
import { Response              } from 'express';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.json({data:'Express + TypeScript Server'});
});

//RUTAS
app.use('/maquina-elemento', maquinaElementoRouter);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

//https://typeorm.io/
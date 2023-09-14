import { AppDataSource } from "./data-source"
import { Express               } from 'express';
import { maquinaElementoRouter } from "./modules/MaquinaElemento/maquinaElementoRouter";
import { Request               } from 'express';
import { Response              } from 'express';
import  dotenv  from 'dotenv';
import  express  from 'express';


dotenv.config();
const app: Express = express();
app.use(express.urlencoded());
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.json({data:'Express + TypeScript Server'});
});

//RUTAS
app.use('/maquina-elemento', maquinaElementoRouter);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

AppDataSource.initialize();

//https://typeorm.io/

/*AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User()
    user.firstName = "Timber"
    user.lastName = "Saw"
    user.age = 25
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))*/

import express from 'express'
import { config } from 'dotenv';
import path from 'path';
import database_connection from './DB/connection.js';
import controllerHandler from './Utils/routersHandler.utils.js';

if (process.env.NODE_ENV === 'dev') config({ path: path.resolve(`src/Config/.dev.env`) })
config()

const boostrap = function () {
    const app = express();
    const port = process.env.PORT
    database_connection()
    app.use(express.json())
    controllerHandler(app)
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

export default boostrap
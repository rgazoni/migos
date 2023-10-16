import { app } from './app';
import 'dotenv/config';
import { Pool, QueryResult } from 'pg';

require('dotenv').config();

//developer's information to create the connection to database
const pool: Pool = new Pool({
    user: process.env.RDS_USER,
    host: process.env.RDS_HOST,
    database: process.env.RDS_DATABASE,
    password: process.env.RDS_PASSWORD,
    port: parseInt(process.env.RDS_PORT || "0")
})
export { pool }


const start = async () => {
    try{    
        console.log("Conectado ao PostgresDB");

        app.listen(3000, () => {
            console.log('Escutando na porta 3000!');
        });
    } catch (error){
        console.log(error)
    }
};

start();
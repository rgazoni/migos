import { app } from './app';
import 'dotenv/config';
import { Pool, QueryResult } from 'pg';

require('dotenv').config();

//developer's information to create the connection to database
const pool: Pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT || "0"),
    ssl: true,
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
})
export { pool }

const start = async () => {
    try{
        console.log("Conectado ao PostgresDB");
 
        pool.query('SELECT NOW()', (err, res) => {
            if (err) {
            console.error('Pool database could not connect!');
            process.exit(0);
            } else {
            console.log('Connected time:', res.rows);
            }
        });

        app.listen(3000, () => {
            console.log('Escutando na porta 3000!');
        });
    } catch (error){
        console.log(error)
    }
};

start();
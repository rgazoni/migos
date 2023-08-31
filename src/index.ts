import { app } from './app';
import 'dotenv/config';
const { Client } = require('pg');
// const dbConfig = require("../config/db-config.js")

require('dotenv').config();

const client = new Client({
    user: process.env.RDS_USER,
    host: process.env.RDS_HOST,
    database: process.env.RDS_DATABASE,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
})

const start = async () => {
    try{    
        await client.connect()  
        console.log("Connected to PostgresDB")
        console.log(process.env.RDS_USER)
        app.listen(5432, () => {
            console.log('Listening on port 3000!');
        });
    } catch (error){
        console.log(error)
    }


    
};

start();
import { pool } from "../../index"
import { PoolClient } from 'pg';

class DatabaseConnection{
    client: PoolClient;

    public async initialize(){         
        //connect a pool with one client 
        this.client = await pool.connect();
    }

    public checkClient(){
        //check if client is undefined and, if it is, return a message to help developers and stop the code
        if(this.client == undefined){ 
            console.log("Query retornou 'undefined'. Checar o uso do await nas funções de inicialização.")
            process.exit(1)
        }
    }

    public close() {
        this.checkClient()
        this.client.release();
    }

    public async newQuery(query: string){
        //create a query and returns all rows
        this.checkClient()
        const res = await this.client.query(query)
        return res;
    }
    

}

export { DatabaseConnection };
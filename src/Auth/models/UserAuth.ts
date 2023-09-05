import { pool } from "../../index"
import { PoolClient } from 'pg';

class UserAuth{
    client: PoolClient;

    public async initialize(){         
        //connect a pool with one client 
        this.client = await pool.connect();
    }

    public checkClient(){
        //check if client is undefined and, if it is, return a message to help developers and stop the code
        if(this.client == undefined){
            console.log("Query as undefined. Check await usage in init function")
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
        return res.rows;
    }
    

}

export { UserAuth };
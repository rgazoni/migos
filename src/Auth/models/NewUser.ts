import { pool } from "../../index"
import { PoolClient } from 'pg';
import { v4 as uuid4 } from 'uuid';
import { Password } from "../services/password";
import { InternalServerError } from "../../common/errors/internal-server-error";

class NewUser{
    client: PoolClient;

    public async initialize(){         
        //connect a pool with one client 
        this.client = await pool.connect();
    }

    public checkClient(){
        //check if client is undefined and, if it is, return a message to help developers and stop the code
        if(this.client == undefined){
            console.log("Query as undefined. Check await usage in init function");
            process.exit(1);
        }
    }

    public close() {
        this.checkClient()
        this.client.release();
    }

    public async newQuery(query: string){
        //create a query and returns all rows
        this.checkClient()
        const res = await this.client.query(query);
        return res;
    }

    public async exists(email: string){
        const db_email = await this.newQuery(`SELECT * FROM user_info WHERE email = '${email}'`);

        if(db_email.rows.length == 0)
            return false;

        return true;
    }

    public async create(email: string, password: string, birth_date: string, first_name: string, last_name: string){
        const user_id = uuid4();
        const hashedPassword = await Password.toHash(password);
        const response = await this.newQuery(`INSERT INTO user_info (user_id, email, birthdate, first_name, last_name, password)
                                                VALUES ('${user_id}', '${email}', '${birth_date}', '${first_name}', '${last_name}', '${hashedPassword}')`);

        
        if(response.rowCount == 0){
            throw new InternalServerError('Something went wrong');
        }
    }
    

}

export { NewUser };
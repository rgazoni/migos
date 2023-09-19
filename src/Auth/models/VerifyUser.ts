import { pool } from "../../index"
import { PoolClient } from 'pg';
import { v4 as uuid4 } from 'uuid';
import { Password } from "../services/password";

class VerifyUser{
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
    
    public async verifySignin(email: string, password: string){
        const user = await this.newQuery(`SELECT * FROM user_info WHERE email = '${email}'`);
        if(user.rows.length > 0){
            const password_db = user.rows[0].password;
            const isPasswordCorrect = await Password.compare(password_db, password);
            if (isPasswordCorrect) {
                console.log("user found.");
                return user;
            } else {
                console.log("Incorrect password.");
                return false;
            }
        }else{
            console.log("User not found");
            return false;
        }
    }     
}
export { VerifyUser };
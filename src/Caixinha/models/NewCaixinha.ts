import { pool } from "../../index"
import { PoolClient } from 'pg';
import { v4 as uuid4 } from 'uuid';

class NewCaixinha{
    caixinha: PoolClient;

    public async initialize(){         
        //connect a pool with one client 
        this.caixinha = await pool.connect();
    }

    public checkClient(){
        //check if client is undefined and, if it is, return a message to help developers and stop the code
        if(this.caixinha == undefined){
            console.log("Query as undefined. Check await usage in init function");
            process.exit(1);
        }
    }

    public close() {
        this.checkClient()
        this.caixinha.release();
    }

    public async newQuery(query: string){
        //create a query and returns all rows
        this.checkClient()
        const res = await this.caixinha.query(query);
        return res;
    }

    // public async create(caixinha_id: string, caixinha_name: string, tag: string, default_amount: number){
    //     const user_id = uuid4(); //usar por enquanto para teste, depois achar um jeito de pegar o id do usuario criado no signup
    //     const response = await this.newQuery(`INSERT INTO user_caixinhas (caixinha_id, caixinha_name, tag, default_amount, user_id)
    //                                             VALUES ('${caixinha_id}', '${caixinha_name}', '${tag}', '${default_amount}', '${user_id}')`);
    // }

    public async createCaixinha(caixinha_id: string, caixinha_name: string, tag: string, default_amount: number, user_id: string){
        const caixinha = await this.newQuery(`SELECT * FROM user_caixinhas WHERE caixinha_name = '${caixinha_name}'`);
        if(caixinha.rows.length>0){
            console.log("caixinha found");
        }else{
            console.log("caixinha not found");
            const response = await this.newQuery(`INSERT INTO user_caixinhas (caixinha_id, caixinha_name, tag, default_amount, user_id)
                                                VALUES ('${caixinha_id}', '${caixinha_name}', '${tag}', '${default_amount}', '${user_id}')`);
            
        }

    }

    public async returnCaixinhas(){
        const allCaixinhas = await this.newQuery('SELECT * FROM user_caixinhas');
        return allCaixinhas.rows;
    }
    
}

export { NewCaixinha }
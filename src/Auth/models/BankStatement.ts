import { InternalServerError } from "../../common/errors/internal-server-error";
import { DatabaseConnection } from "../../common/models/DatabaseConnection";
import { v4 as uuid4 } from 'uuid';


class BankStatement extends DatabaseConnection{
    public async insert(statements: Array<{ transaction_id: string, description: string, amount: number, title: string, user_id: string, caixinha_id: string }>){
        let query = `INSERT INTO bank_statement (transaction_id, description, amount, time, title, user_id, caixinha_id) VALUES `;
        let length = statements.length;
        let timestamp_str = Date.now();
        let timestamp = +timestamp_str;
        let statement;
        
        if(length == 0){
            throw new InternalServerError('empty array');
        }

        statements.forEach(element => {
            statement = `('${element.transaction_id}', '${element.description}', '${element.amount}', '${timestamp}', '${element.title}', '${element.user_id}', '${element.caixinha_id}')`;
            
            length = length - 1;
            if(length != 0){
                statement = statement.concat(`,`);
            } else{
                statement = statement.concat(`;`);
            }

            query = query.concat(statement);
        });

        const response = await this.newQuery(query);

        if(response.rowCount == 0){
            throw new InternalServerError('Something went wrong');
        }
    }


    public async findUserById(user_id: string){
        const query = `SELECT * FROM user_info WHERE email = '${user_id}'`;
    
        const response = await this.newQuery(query);
        if(response.rowCount == 0){
            throw new InternalServerError('Something went wrong');
        }

        return response.rows;
    }
}

export { BankStatement };
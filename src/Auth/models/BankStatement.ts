import { InternalServerError } from "../../common/errors/internal-server-error";
import { DatabaseConnection } from "../../common/models/DatabaseConnection"

class BankStatement extends DatabaseConnection{
    public async insert(transaction_id: string, description: string, amount: bigint, time: string, title: string, user_id: string){
        const query = `INSERT INTO bank_statement (transaction_id, description, amount, time, title, user_id)
                        VALUES ('${transaction_id}', '${description}', '${amount}', '${time}', '${title}', '${user_id}')`
        const response = await this.newQuery(query);

        if(response.rowCount == 0){
            throw new InternalServerError('Something went wrong');
        }
    }

    public async findAll(user_id: string){
        const query = `SELECT * FROM user_info WHERE email = '${user_id}'`;
    
        const response = await this.newQuery(query);
        if(response.rowCount == 0){
            throw new InternalServerError('Something went wrong');
        }

        return response.rows;
    }
}

export { BankStatement };
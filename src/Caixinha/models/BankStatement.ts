import { InternalServerError } from "../../common/errors/internal-server-error";
import { DatabaseConnection } from "../../common/models/DatabaseConnection";
import { v4 as uuid4 } from 'uuid';


class BankStatement extends DatabaseConnection{
    public async insert(statements: Array<{ transaction_id: string, amount: number, title: string, user_id: string, caixinha_id: string }>){
        let query = `INSERT INTO bank_statement (transaction_id, amount, time, title, user_id, caixinha_id) VALUES `;
        let length = statements.length;
        let timestamp_str = Date.now();
        let timestamp = +timestamp_str;
        let statement;
        
        if(length == 0){
            throw new InternalServerError('empty array');
        }

        statements.forEach(element => {
            statement = `('${element.transaction_id}', '${element.amount}', '${timestamp}', '${element.title}', '${element.user_id}', '${element.caixinha_id}')`;
            
            length = length - 1;
            if(length != 0){
                statement = statement.concat(`,`);
            } else{
                statement = statement.concat(` ON CONFLICT (transaction_id) DO NOTHING;`);
            }

            query = query.concat(statement);
        });
        console.log(query);
        const response = await this.newQuery(query);
        console.log(response);
        if(response.rowCount == 0){
            throw new InternalServerError('Something went wrong');
        }
    }


    public async fetch_month_statements(user_id: string, MM: string, YYYY: number){

        const statements = await this.newQuery(`SELECT * FROM bank_statement 
                                               WHERE user_id = '${user_id}' 
                                               AND TO_CHAR(TO_TIMESTAMP(time / 1000), 'MM YYYY') = '${MM} ${YYYY}'`);

        if(!statements.rows.length)
            return { results: [] };

        return { results: statements.rows };
    }
}

export { BankStatement };
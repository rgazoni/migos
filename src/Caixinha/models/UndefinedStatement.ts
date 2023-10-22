import { DatabaseConnection } from "../../common/models/DatabaseConnection";
import { InternalServerError } from "../../common/errors/internal-server-error";

class UndefinedStatement extends DatabaseConnection{
    
    public async insert(statements_unrelated: Array<{transaction_id: string,  amount: number, tag: string, user_id: string}>){
        const timestamp = Date.now();
        let query = `INSERT INTO statements_unrelated (transaction_id, amount, time, title, user_id) VALUES`;
        let length = statements_unrelated.length;
        let statement;

        if(length == 0){
            throw new InternalServerError('Array Vazio');
        }

        statements_unrelated.forEach(element => {
            statement = `('${element.transaction_id}', '${element.amount}', '${timestamp}', '${element.tag}', '${element.user_id}')`;
            
            length = length - 1;
            if(length != 0){
                statement = statement.concat(`,`);
            } else{
                statement = statement.concat(` ON CONFLICT (transaction_id) DO NOTHING;`); 
            }

            query = query.concat(statement);
        });

        await this.newQuery(query);

        // if(response.rowCount == 0){
        //     throw new InternalServerError('Estes dados já existem');
        // }
    }

    public async delete(statements_unrelated: Array<{ transaction_id: string }>) {
        if (statements_unrelated.length === 0) {
            throw new InternalServerError('Array vazio');
        }
    
        const transactionIds = statements_unrelated.map(element => `'${element.transaction_id}'`).join(', ');
        const query = `DELETE FROM statements_unrelated WHERE transaction_id IN (${transactionIds})`;
        const response = await this.newQuery(query);
        if(response.rowCount === 0){
            throw new InternalServerError('ID não encontrado');
        }
        
    }

    public async fetch_month_undefined_statements(user_id: string, MM: string, YYYY: number){

        const statements = await this.newQuery(`SELECT * FROM statements_unrelated 
                                               WHERE user_id = '${user_id}' 
                                               AND TO_CHAR(TO_TIMESTAMP(time / 1000), 'MM YYYY') = '${MM} ${YYYY}'`);

        if(!statements.rows.length)
            return { results: [] };

        return { results: statements.rows };

    }
}

export { UndefinedStatement }
import { DatabaseConnection } from "../../common/models/DatabaseConnection";
import { InternalServerError } from "../../common/errors/internal-server-error";

class UndefinedStatement extends DatabaseConnection{
    
    public async insert(undefined_statements: Array<{transaction_id: string,  amount: number, title: string, user_id: string}>){
        const timestamp = Date.now();
        let query = `INSERT INTO undefined_statements (transaction_id, amount, time, title, user_id) VALUES`;
        let length = undefined_statements.length;
        let statement;

        // if(length == 0){
        //     throw new InternalServerError('Array Vazio');
        // }

        undefined_statements.forEach(element => {
            statement = `('${element.transaction_id}', '${element.amount}', '${timestamp}', '${element.title}', '${element.user_id}')`;
            
            length = length - 1;
            if(length != 0){
                statement = statement.concat(`,`);
            } else{
                statement = statement.concat(` ON CONFLICT (transaction_id) DO NOTHING;`); 
            }

            query = query.concat(statement);
        });

        const response = await this.newQuery(query);

        if(response.rowCount == 0){
            throw new InternalServerError('Estes dados já existem');
        }
    }

    public async delete(undefined_statements: Array<{ transaction_id: string }>) {
        if (undefined_statements.length === 0) {
            throw new InternalServerError('Array vazio');
        }
    
        const transactionIds = undefined_statements.map(element => `'${element.transaction_id}'`).join(', ');
        const query = `DELETE FROM undefined_statements WHERE transaction_id IN (${transactionIds})`;
        const response = await this.newQuery(query);
        if(response.rowCount === 0){
            throw new InternalServerError('ID não encontrado');
        }
        
    }

    public async fetch_month_undefined_statements(user_id: string, MM: string, YYYY: number){

        const statements = await this.newQuery(`SELECT * FROM undefined_statements 
                                               WHERE user_id = '${user_id}' 
                                               AND TO_CHAR(TO_TIMESTAMP(time / 1000), 'MM YYYY') = '${MM} ${YYYY}'`);

        console.log("statements.rows: ", statements.rows);
        if(!statements.rows.length)
            return { results: [] };

        return { results: statements.rows };

    }
}

export { UndefinedStatement }
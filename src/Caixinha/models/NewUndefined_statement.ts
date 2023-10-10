import { DatabaseConnection } from "../../common/models/DatabaseConnection";

class NewUndefined_statement extends DatabaseConnection{
    
    public async create_undefined_statements(transaction_id: string,  amount: number, title: string, user_id: string){
        const timestamp = Date.now();
        console.log(timestamp);

        await this.newQuery(`INSERT INTO undefined_statements (transaction_id, amount, time, title, user_id)
            VALUES ('${transaction_id}', '${amount}', '${timestamp}', '${title}', '${user_id}')`);
    }

    public async remove_data(transaction_id : string){
        await this.newQuery(`DELETE FROM undefined_statements Where transaction_id = '${transaction_id}' `);
        console.log(transaction_id);
    }

    public async return_undefined_statements(user_id: string){
        const data = await this.newQuery(`SELECT *FROM undefined_statements WHERE user_id = '${user_id}'`);
    }
}

export { NewUndefined_statement }
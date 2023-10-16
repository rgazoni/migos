import { DatabaseConnection } from "../../common/models/DatabaseConnection";

class BankApi extends DatabaseConnection{

    public async get_statements(user_id: string){

        const statements = await this.newQuery(`SELECT * FROM bank_api WHERE user_id = '${user_id}'`);

        if(!statements.rows.length)
            return { results: [] };

        return { results: statements.rows };
    }


    public async get_month_statements(user_id: string, MM: string, YYYY: number){

        const statements = await this.newQuery(`SELECT * FROM bank_api 
                                               WHERE user_id = '${user_id}' 
                                               AND EXTRACT('Month' from time) = '${MM}'
                                               AND TO_CHAR(time, 'YYYY') = '${YYYY}'`);

        if(!statements.rows.length)
            return { results: [] };

        return { results: statements.rows };
    }
}
export { BankApi };

import { DatabaseConnection } from "../../common/models/DatabaseConnection";

class BankApi extends DatabaseConnection{

    public async get_statements(user_id: string, last_update: number){

        const statements = await this.newQuery(`
            SELECT * FROM bank_api
            WHERE user_id = '${user_id}'
            AND time > ${last_update}
            ORDER BY time DESC
        `);

        if(!statements.rows.length)
            return { results: [] };

        return { results: statements.rows };
    }


    public async get_month_statements(user_id: string, MM: string, YYYY: number){

        const statements = await this.newQuery(`
            SELECT * FROM bank_api
            WHERE user_id = '${user_id}'
            AND EXTRACT(MONTH FROM TO_TIMESTAMP(time)) = '${MM}'
            AND EXTRACT(YEAR FROM TO_TIMESTAMP(time)) = '${YYYY}'
        `);

        if(!statements.rows.length)
            return { results: [] };

        return { results: statements.rows };
    }
}
export { BankApi };

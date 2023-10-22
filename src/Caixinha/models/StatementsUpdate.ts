import { DatabaseConnection } from "../../common/models/DatabaseConnection";

class StatementsUpdate extends DatabaseConnection{

    public async fetchLastUpdate(user_id: string){
        const update = await this.newQuery(`SELECT timestamp FROM statements_all_updates WHERE user_id = '${user_id}' ORDER BY timestamp DESC LIMIT 1`);
        if(update.rows.length > 0)
            return update.rows[0].timestamp;
        return undefined;
    }

    public async store_timestamp_operation(user_id: string, timestamp_operation: number){
        await this.newQuery(`INSERT INTO statements_all_updates (timestamp, user_id)
                VALUES ('${timestamp_operation}', '${user_id}')`)
    }

}
export { StatementsUpdate }

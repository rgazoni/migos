import { BankApi } from "../models/BankApi";

export class BankModule {

    static async fetch_statements(user_id: string){

        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        let bank = new BankApi();

        await bank.initialize();

        const statements = await bank.get_month_statements(user_id, month.toString(), year); 
        bank.close();

        return statements;
 
    }

}

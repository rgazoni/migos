import { BankApi } from "../models/BankApi";
import { BankStatement } from "../models/BankStatement";
import { Caixinhas } from "../models/Caixinhas";
import { StatementsUpdate } from "../models/StatementsUpdate";
import { UndefinedStatement } from "../models/UndefinedStatement";

interface HashTable<T> {
    [key: string]: T;
}

export class BankModule {

    static async fetch_month_statements(user_id: string){

        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        let bank = new BankApi();

        await bank.initialize();
        const statements = await bank.get_month_statements(user_id, month.toString(), year);
        bank.close();

        return statements.results;
    }

    static async fetch_statements(user_id: string, last_update_date: number){

        let bank = new BankApi();

        await bank.initialize();
        const statements = await bank.get_statements(user_id, last_update_date);
        bank.close();

        return statements.results;
    }

    static async fetch_caixinha_tags(user_id: string){
        const caixinhas = new Caixinhas();
        await caixinhas.initialize();
        const tags = await caixinhas.fetchCaixinhaTags(user_id);
        return tags;
    }

    static async fetch_last_updated(user_id: string){
        const update = new StatementsUpdate();
        await update.initialize();
        const last_update = await update.fetchLastUpdate(user_id);
        return last_update;
    }

    static async store_timestamp_operation(user_id: string, timestamp_operation: number){
        const update = new StatementsUpdate();
        await update.initialize();
        await update.store_timestamp_operation(user_id, timestamp_operation);
    }

    static async match_statements(user_id: string){

        const last_update : number = await BankModule.fetch_last_updated(user_id);

        const timestamp_operation = Date.now();

        let statements, tags;
        if(!last_update) {
            [statements, tags] = await Promise.all([
                BankModule.fetch_month_statements(user_id),
                BankModule.fetch_caixinha_tags(user_id)
            ]);
        } else {
            [statements, tags] = await Promise.all([
                BankModule.fetch_statements(user_id, last_update),
                BankModule.fetch_caixinha_tags(user_id)
            ]);
        }

        await BankModule.store_timestamp_operation(user_id, timestamp_operation)

        const hash_tags : HashTable<string> = {};
        tags.map( tag => { 
            if (hash_tags[tag.tag])
                return;
            hash_tags[tag.tag] = tag.caixinha_id;
        });

        const bank_statements: any[] = [];
        const undefined_statements: any[] = [];

        statements.forEach( (statement) => {
            if (hash_tags[statement.title]) {
                statement["caixinha_id"] = hash_tags[statement.title]; 
                bank_statements.push(statement);
            } else {
                undefined_statements.push(statement);
            }
        });

        if (bank_statements.length != 0){
            const bank_statement = new BankStatement();
            await bank_statement.initialize();
            await bank_statement.insert(bank_statements);
            bank_statement.close();
        }
        if (undefined_statements.length != 0){
            const undefined_statement = new UndefinedStatement();
            await undefined_statement.initialize();
            await undefined_statement.insert(undefined_statements);
            undefined_statement.close();
        }

        return true;
    }

}

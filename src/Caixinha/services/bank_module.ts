import { BankApi } from "../models/BankApi";
import { BankStatement } from "../models/BankStatement";
import { Caixinhas } from "../models/Caixinhas";
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
    
    static async fetch_caixinha_tags(user_id: string){
        const caixinhas = new Caixinhas();
        await caixinhas.initialize();
        const tags = await caixinhas.fetchCaixinhaTags(user_id);
        return tags;
    }

    static async match_statements(user_id: string){

        //This could be later improved to make a more complex query looking also
        //to undefined data and bank statements, in order to fetch from the bank api
        //just the last transactions accordingly to time, that yet was not fetched.

        const [statements, tags] = await Promise.all([
            BankModule.fetch_month_statements(user_id),
            BankModule.fetch_caixinha_tags(user_id)
        ]);
    
        // const statements : any[] = await BankModule.fetch_month_statements(user_id);
        // const tags = await BankModule.fetch_caixinha_tags(user_id);

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

        const bank_statement = new BankStatement();
        await bank_statement.initialize();
        await bank_statement.insert(bank_statements);
        bank_statement.close();

        const undefined_statement = new UndefinedStatement();
        await undefined_statement.initialize();
        await undefined_statement.insert(undefined_statements);
        undefined_statement.close();


        console.log(bank_statements, undefined_statements)

    }

}

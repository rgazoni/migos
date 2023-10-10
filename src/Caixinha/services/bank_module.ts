import { BankApi } from "../models/BankApi";
import { Caixinhas } from "../models/Caixinhas";

interface HashTable<T> {
    [key: string]: T;
}

export class BankModule {

    static async fetch_statements(user_id: string){

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

    static async match_statements(){
       
        const user_id = "678ebd14-510f-4954-bdf3-dc0dea9aef0c";
        const statements : any[] = await BankModule.fetch_statements(user_id);
        const tags = await BankModule.fetch_caixinha_tags('123');

        const hash_tags : HashTable<string> = {};
        tags.map( tag => { 
            if (hash_tags[tag.tag])
                return;
            hash_tags[tag.tag] = tag.caixinha_id;
        });

        const bank_statements = [];
        const undefined_statements = [];

        statements.forEach( (statement) => {
            if (hash_tags[statement.title]) {
                statement["caixinha_id"] = hash_tags[statement.title]; 
                bank_statements.push(statement);
            } else {
                undefined_statements.push(statement);
            }
        });

    }

}

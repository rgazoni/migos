import { BankStatement } from "../models/BankStatement";
import { Caixinhas } from "../models/Caixinhas";

interface HashTable<T> {
    [key: string]: T;
}

interface UserInfoOutput {
    total_income: number;
    total_outcome: number;
    info_per_caixinha: CaixinhaOutput[];
}

interface StatementsOutput {
    transaction_id: string;
    amount: number;
    title: string;
    time: string;
}

interface CaixinhaOutput {
    tag: string;
    caixinha_name: string;
    default_amount: number;
    total_amount: number;
    total_left: number;
    relatedStatements?: StatementsOutput[];
}

export class CaixinhaInfos{

    private summary: UserInfoOutput;

    constructor() {
        this.summary = {
            total_income: 0,
            total_outcome: 0,
            info_per_caixinha: []
        };
    }

    private async getCaixinhas(user_id: string) {
        const Caixinha = new Caixinhas();
        await Caixinha.initialize();

        const caixinhas = await Caixinha.fetchUserCaixinhas(user_id);
        return caixinhas;
    }

    private async get_month_bank_statements(user_id: string) {

        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        const statements = new BankStatement();
        await statements.initialize();
        const user_statements = await statements.fetch_month_statements(user_id, month.toString(), year);

        return user_statements.results;
    }

    public async compute_caixinha_spends(user_id: string) {

        const [user_statements, user_caixinhas] = await Promise.all([
            this.get_month_bank_statements(user_id),
            this.getCaixinhas(user_id)
        ]);

        const hash_tags : HashTable<CaixinhaOutput> = {};
        user_caixinhas.map( caixinha => {
            if (!hash_tags[caixinha.tag]) {
                hash_tags[caixinha.tag] = {
                    tag: caixinha.tag,
                    caixinha_name: caixinha.caixinha_name,
                    default_amount: caixinha.default_amount,
                    total_amount: 0,
                    total_left: caixinha.default_amount,
                    relatedStatements: []
                };
            }
        });

        user_statements.forEach(statement => {
            const currentCaixinha : CaixinhaOutput = hash_tags[statement.title];
            if (currentCaixinha) {
                currentCaixinha.total_amount += statement.amount;
                currentCaixinha.total_left -= statement.amount;
                currentCaixinha.relatedStatements!.push({
                    transaction_id: statement.transaction_id,
                    amount: statement.amount,
                    title: statement.title,
                    time: statement.time
                });
            }
        });

        for (const key in hash_tags) {
            if (hash_tags.hasOwnProperty(key)) {
                const caixinha_content = hash_tags[key];

                this.summary.total_income += caixinha_content.default_amount;
                caixinha_content.relatedStatements!.forEach( caixinha => {
                    this.summary.total_outcome += caixinha.amount;
                });

                this.summary.info_per_caixinha.push({
                    tag: caixinha_content.tag,
                    caixinha_name: caixinha_content.caixinha_name,
                    default_amount: caixinha_content.default_amount,
                    total_left: caixinha_content.total_left,
                    total_amount: caixinha_content.total_amount
                })
            }
        }

        return this.summary;
    }


}
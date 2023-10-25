import express, { Response, Request } from 'express';
import { Caixinhas, CaixinhasInformation } from '../models/Caixinhas';
import { BankStatement } from '../models/BankStatement';

const router = express.Router();

router.get(
    '/api/users/caixinhas/:user_id/:caixinha_id',
    async (req: Request, res: Response) => {

        const user_id = req.params.user_id;
        const caixinha_id = req.params.caixinha_id;

        const statements = new BankStatement();

        await statements.initialize();

        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        const related_statements = await statements.caixinha_statements_by_month(user_id, caixinha_id, month.toString(), year);

        const allstatements = related_statements.map( statement => {
            return {
                transaction_id : statement.transaction_id,
                amount : statement.amount,
                time : statement.time,
                tag : statement.title,
             }
        })

        res.status(200).json({ results: allstatements }); 
    }
);

export { router as caixinhaStatementsRouter };

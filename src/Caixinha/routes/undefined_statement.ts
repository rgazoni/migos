import express, { Response, Request } from 'express';
import { UndefinedStatement } from '../models/UndefinedStatement';
import { Caixinhas } from '../models/Caixinhas';

const router = express.Router();

router.get(
    '/api/users/undefined_statement/:user_id',
    async (req: Request, res: Response) => {
        const user_id : string = req.params.user_id;

        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        const undefined_statements = new UndefinedStatement();
        await undefined_statements.initialize();

        const { results: und_statements } = await undefined_statements.fetch_month_undefined_statements(user_id, month.toString(), year); 
        undefined_statements.close();

        const caixinhas = new Caixinhas();
        await caixinhas.initialize();
        const tags = await caixinhas.fetchCaixinhaTags(user_id);

        const response = { undefined_statements: und_statements, tags: tags }

        res.status(200).json(response);
    }
);

export { router as UndefinedStatementRouter };
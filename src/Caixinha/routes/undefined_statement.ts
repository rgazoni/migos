import express, { Response, Request } from 'express';
import { validateRequest } from '../../Auth/middlewares/validate-request';
import { NewUndefined_statement } from '../models/NewUndefined_statement';

const router = express.Router();

router.post(
    '/api/users/undefined_statement',
    //  /:transaction_id
    async (req: Request, res: Response) => {
        //const transaction_id = req.params.transaction_id;
        const undefined_statements = new NewUndefined_statement();

        await undefined_statements.initialize();
        await undefined_statements.create_undefined_statements("1234", 200, "ASDAD", "4567");
        undefined_statements.close();
        res.status(200).send("inserido com sucesso");
        //await undefined_statements.remove_data(transaction_id);
    }
);

export { router as Undefined_statementRouter };
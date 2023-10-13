import express, { Response, Request } from 'express';
import { UndefinedStatement } from '../models/UndefinedStatement';

const router = express.Router();

router.get(
    '/api/users/undefined_statement/:user_id',
    // /:user_id
    async (req: Request, res: Response) => {
        const user_id = req.params.user_id;
        const undefined_statements = new UndefinedStatement();

        await undefined_statements.initialize();
        const data = await undefined_statements.fetch_undefined_statements(user_id);
        
        // const array = [
        //     {
        //         "transaction_id": "12348",
        //         "amount": 235,
        //         "title": "asdasdsafsa",
        //         "user_id": "456"
        //     },
        //     {
        //         "transaction_id": "123485454",
        //         "amount": 456,
        //         "title": "asdasdsafsa",
        //         "user_id": "123"
        //     },
        //     {   
        //         "transaction_id": "12344548",
        //         "amount": 1522,
        //         "title": "asdasdsafsaasdaadsd",
        //         "user_id": "123"
        //     },
        //     {   
        //         "transaction_id": "12348545",
        //         "amount": 2000,
        //         "title": "asdasdsafsaasdaadsd",
        //         "user_id": "145"
        //     }
        // ]
        // await undefined_statements.insert_undefined_statements(array);
        // const array = [
        //     {
        //         "transaction_id": "12345"
        //     }
        // ]
        // await undefined_statements.delete_data(array);
        undefined_statements.close();
        //res.status(200).send("criado");
        res.status(200).json(data);
        
    }   
);


export { router as UndefinedStatementRouter };
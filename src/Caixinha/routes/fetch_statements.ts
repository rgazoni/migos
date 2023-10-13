import express, { Response, Request } from 'express';
import { BankModule } from '../services/bank_module';

const router = express.Router();

router.get(
    '/api/users/statements/:user_id',
    async (req: Request, res: Response) => {

        const user_id = req.params.user_id;
        console.log("user_id: ", user_id);
        const statements = await BankModule.match_statements(user_id);
        
        //if the query was successfully done, then send it to postman
        res.status(200).send( statements );
    });

export { router as fetch_statements_router };

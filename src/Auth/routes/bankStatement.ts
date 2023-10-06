import express, { Response, Request } from 'express';
import { Signup } from '../models/Signup';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../../common/errors/bad-request-error';
import { BankStatement } from '../models/BankStatement';

const router = express.Router();

router.get("/api/users/bankStatement/user_id", async (req: Request, res: Response) => {
    const { user_id } = req.body;

    let bank_table = new BankStatement();

    await bank_table.initialize();
    const data = await bank_table.findAll(user_id); 
    bank_table.close();

    res.status(200).send( data );
});

export { router as bankStatementRoute };

import express, { Response, Request } from 'express';
import { CaixinhaInfos } from '../services/caixinha_infos';
import { BankModule } from '../services/bank_module';

const router = express.Router();

router.get(
    '/api/users/statements/:user_id',
    async (req: Request, res: Response) => {

        const user_id = req.params.user_id;

        //Set a timeout to prevent dalaying to much
        await BankModule.match_statements(user_id);

        const user_info = new CaixinhaInfos();
        const all_info = await user_info.compute_caixinha_spends(user_id);

        //Set state to updated or not_updated depending on bank statement call
        res.status(200).send({
            state: 'updated',
            results: all_info
        });

    });

export { router as userInfoRouter };

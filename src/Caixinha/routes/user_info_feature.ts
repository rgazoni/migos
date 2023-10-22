import express, { Response, Request } from 'express';
import { CaixinhaInfos } from '../services/caixinha_infos';
import { BankModule } from '../services/bank_module';

const router = express.Router();

router.get(
    '/api/users/statements/:user_id',
    async (req: Request, res: Response) => {

        const user_id = req.params.user_id;

        let state = '';
        try {
            const result = await withTimeout(
                BankModule.match_statements(user_id),
                10000
            );
            state = 'updated';
            console.log(result);
        } catch (error) {
            state = 'not_updated';
            console.error(error);
        }

        const user_info = new CaixinhaInfos();
        const all_info = await user_info.compute_caixinha_spends(user_id);

        //Set state to updated or not_updated depending on bank statement call timeout
        res.status(200).send({
            state: state,
            results: all_info
        });

    });

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeoutMs)
        )
    ]);
}

export { router as userInfoRouter };

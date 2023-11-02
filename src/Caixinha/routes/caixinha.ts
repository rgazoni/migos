import express, { Response, Request } from 'express';
import { Caixinhas } from '../models/Caixinhas';
import { body } from 'express-validator';
import { validateRequest } from '../../Auth/middlewares/validate-request';
import { BankModule } from '../services/bank_module';
import { CaixinhaInfos } from '../services/caixinha_infos';

const router = express.Router();

router.get(
    '/api/users/caixinhas/infos/:user_id',
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
            results: all_info.info_per_caixinha
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

router.post(
    '/api/users/caixinha',
    [
        body('user_id')
            .notEmpty()
            .withMessage("user_id must be valid"),
        body('caixinha_name')
            .notEmpty()
            .withMessage("nome inválido"),
        body('tag')
            .notEmpty()
            .withMessage("tag inválida"),
        body('default_amount')
            .notEmpty()
            .withMessage("quantidade inválida")
    ],
    validateRequest,

    async (req: Request, res: Response) => {
        const { user_id, caixinha_name, tag, default_amount } = req.body;
        const caixinha = new Caixinhas();

        await caixinha.initialize();
        await caixinha.createCaixinha(caixinha_name, tag, default_amount, user_id);
        caixinha.close();

        res.status(200).json({ 
            message: "Caixinha adicionada com sucesso",
            caixinha_name,
            tag,
            default_amount
          });
    },

);

export { router as caixinhaRouter };

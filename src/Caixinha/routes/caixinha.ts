import express, { Response, Request } from 'express';
import { Caixinhas } from '../models/Caixinhas';
import { body } from 'express-validator';
import { validateRequest } from '../../Auth/middlewares/validate-request';
import { BankModule } from '../services/bank_module';

const router = express.Router();

router.get(
    '/api/users/caixinhas/infos/:user_id',
    async (req: Request, res: Response) => {
        const user_id = req.params.user_id;
        const caixinhas = new Caixinhas();
    
        await caixinhas.initialize();
        const caixinhasData = await caixinhas.fetchUserCaixinhas(user_id);
        res.status(200).json(caixinhasData); 
    }
);

router.post(
    '/api/users/caixinha',
    [
        body('user_id')
            .notEmpty()
            .withMessage("user_id must be valid"),
        body('caixinha_name')
            .notEmpty()
            .withMessage("name must be valid"),
        body('tag')
            .notEmpty()
            .withMessage("tag must be valid"),
        body('default_amount')
            .notEmpty()
            .withMessage("amount must be valid")
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

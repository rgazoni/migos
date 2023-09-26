import express, { Response, Request } from 'express';
import { NewCaixinha } from '../models/NewCaixinha';
import { body } from 'express-validator';
import { validateRequest } from '../../Auth/middlewares/validate-request';

const router = express.Router();

router.get(
    '/api/users/caixinha',
    async (req: Request, res: Response) => {
        const caixinhas = new NewCaixinha();
        await caixinhas.initialize();
        const caixinhasData = await caixinhas.returnCaixinhas();
        caixinhas.close();
        res.status(200).json(caixinhasData);
    }
);

router.post(
    '/api/users/caixinha',
    [
        body('caixinha_id')
            .notEmpty()
            .withMessage("Name must be valid"),
        body('caixinha_name')
            .notEmpty()
            .withMessage("Tag must be valid"),
        body('tag')
            .notEmpty()
            .withMessage("Amoug must be valid"),
        body('default_amount')
            .toFloat()
            .notEmpty()
            .withMessage("Box Id must be valid")
    ],
    validateRequest,

    async (req: Request, res: Response) => {
        const { caixinha_id, caixinha_name, tag, default_amount } = req.body;
        let caixinha = new NewCaixinha();

        await caixinha.initialize();
        const user_id = ''
        await caixinha.createCaixinha(caixinha_id, caixinha_name, tag, default_amount, user_id);
        caixinha.close();

        res.status(200).send({ caixinha_id, caixinha_name, tag, default_amount });
    },

);

export { router as caixinhaRouter };
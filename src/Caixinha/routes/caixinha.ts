import express, { Response, Request } from 'express';
import { Caixinhas, CaixinhasInformation } from '../models/Caixinhas';
import { body } from 'express-validator';
import { validateRequest } from '../../Auth/middlewares/validate-request';

const router = express.Router();

router.get(
    '/api/users/caixinhas/infos/:user_id',
    async (req: Request, res: Response) => {
        const user_id = req.params.user_id;
        const caixinhas = new Caixinhas();
    
        await caixinhas.initialize();
        const caixinhasData = await caixinhas.fetchUserCaixinhas(user_id);

        const caixinhasInformation : CaixinhasInformation[] = caixinhasData.map( caixinha => {
            return {
                caixinha_name : caixinha.caixinha_name,
                tag : caixinha.tag,
                default_amount : caixinha.default_amount,
                caixinha_id : caixinha.caixinha_id
             }
        })

        res.status(200).json(caixinhasInformation); 
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

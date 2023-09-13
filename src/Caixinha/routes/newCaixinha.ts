import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { getAllJSDocTagsOfKind } from 'typescript';


const router = express.Router();


router.get(
    '/users/caixinha/new'
    [],
    validateRequest,
   
    async (req: Request, res: Response) => {
        const { caixinha_id, tag, user_id, related_tags, default_amount, caixinha_name} = req.body;
        
        await user.initialize();
    
        if(await user.exists(email)){
           
            return;
        }

        //Select in DB
        //Send to Enzinho do Xubiu in the front
    
        await user.create();
        user.close();
    
        res.status(200).send({ });
      },
);


export { router as newCaixinhaRouter };

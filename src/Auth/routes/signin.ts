import express, { Response, Request } from 'express';
//import { UserAuth } from '../models/UserAuth';
import { Signin } from '../models/Signin';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
    '/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        //create a new connection to AWS RDS using an UserAuth class
        //let auth = new UserAuth(); 
        let user = new Signin();
        //create a new connection, requires a new query and close 
        await user.initialize();

        const existingUser = await user.verifySignin(email, password); //await user.newQuery(`SELECT password FROM user_info WHERE email = '${email}'`);
        
        user.close();
        
        //if the query was successfully done, then send it to postman
        res.status(200).send( existingUser );
    });

export { router as signinRouter };

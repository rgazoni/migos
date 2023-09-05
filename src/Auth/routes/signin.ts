import express, { Response, Request } from 'express';
import { UserAuth } from '../models/UserAuth';

const router = express.Router()

router.post(
    '/api/users/signin',
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        //create a new connection to AWS RDS using an UserAuth class
        let auth = new UserAuth(); 
        
        //create a new connection, requires a new query and close 
        auth.initialize();
        const existingUser = await auth.newQuery(`SELECT email FROM user_auth WHERE email = '${email}'`);
        auth.close();

        //if the query was successfully done, then send it to postman
        res.status(200).send( existingUser );
    });

export { router as signinRouter }
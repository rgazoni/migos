import express, { Response, Request } from 'express';

const router = express.Router()

router.post(
    '/api/users/signin',
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        res.status(200).send({ email, password });
    });


export { router as signinRouter }
import express, { Response, Request } from 'express';
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

      res.status(200).send({ email, password });
});

export { router as signinRouter };

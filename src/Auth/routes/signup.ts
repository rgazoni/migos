import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
    '/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
   signin-expressvalidator
            .withMessage('Password must have at least eight characters being at least one uppercase, one number and one special character'),
        body('birthDate')
            .isISO8601()
            .notEmpty()
            .withMessage('You must supply a correct birth date'),
        body('firstName')
            .matches("^[A-Za-zãáâéêíôõóú\s]+$")
            .notEmpty()
            .withMessage('You must supply a correct name'),
        body('lastName')
            .matches("^[A-Za-zãáâéêíôõóú\s]+$")
            .notEmpty()
            .withMessage('You must supply a correct last name'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password, birthDate, firstName, lastName } = req.body;

        res.status(200).send({ email, password, birthDate, firstName, lastName });
    }
);

export { router as signupRouter };


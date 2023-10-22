import express, { Response, Request } from 'express';
import { Signup } from '../models/Signup';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../../common/errors/bad-request-error';

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "A senha deve ter no mínimo oito caracteres sendo pelo menos uma maiúscula, um minúsculo, um número e um caractere especial"
      ),
    body("birth_date")
      .isISO8601()
      .notEmpty()
      .withMessage("Você deve fornecer uma data de nascimento correta"),
    body("first_name")
      .matches("^[A-Za-zãáâéêíôõóú.\'\-\\s]+$")
      .notEmpty()
      .withMessage("Você deve fornecer um nome correto"),
    body("last_name")
      .matches("^[A-Za-zãáâéêíôõóú.\'\-\\s]+$")
      .notEmpty()
      .withMessage("Você deve fornecer um sobrenome correto"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, birth_date, first_name, last_name } = req.body;
    let user = new Signup();

    await user.initialize();

    if (await user.exists(email)) {      
      throw new BadRequestError('Email already exists');
    }

    await user.create(email, password, birth_date, first_name, last_name);
    user.close();

    res.status(200).send({ email, password, birth_date, first_name, last_name });
  }
);


export { router as signupRouter };

import express, { Response, Request } from "express";
import { NewUser } from "../models/NewUser";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../../common/errors/bad-request-error";

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
        "Password must have at least eight characters being at least one uppercase, one number and one special character"
      ),
    body("birth_date")
      .isISO8601()
      .notEmpty()
      .withMessage("You must supply a correct birth date"),
    body("first_name")
      .matches("^[A-Za-zãáâéêíôõóú.'-\\s]+$")
      .notEmpty()
      .withMessage("You must supply a correct name"),
    body("last_name")
      .matches("^[A-Za-zãáâéêíôõóú.'-\\s]+$")
      .notEmpty()
      .withMessage("You must supply a correct last name"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, birth_date, first_name, last_name } = req.body;
    let user = new NewUser();

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

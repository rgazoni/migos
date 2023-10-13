require("express-async-errors");
import express from "express";
import { json } from "body-parser";

// Importing routes
import { signinRouter } from "./Auth/routes/signin";
import { signupRouter } from "./Auth/routes/signup";
import { caixinhaRouter } from "./Caixinha/routes/caixinha";
import { errorHandler } from './common/middlewares/error-handler';
import { NotFoundError } from './common/errors/not-found-error';
import { Undefined_statementRouter } from "./Caixinha/routes/undefined_statement";



const app = express();

app.set("trust proxy", true);
app.use(json());

// Use routes
app.use(signinRouter);
app.use(signupRouter);
app.use(caixinhaRouter);
app.use(Undefined_statementRouter);



//We have installed a library to workaround the default pattern that
//JS deals with throw and async communication
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

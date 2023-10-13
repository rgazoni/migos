require("express-async-errors");
import express from "express";
import { json } from "body-parser";

// Importing routes
import { signinRouter } from "./Auth/routes/signin";
import { signupRouter } from "./Auth/routes/signup";
import { caixinhaRouter } from "./Caixinha/routes/caixinha";
import { errorHandler } from './common/middlewares/error-handler';
import { NotFoundError } from './common/errors/not-found-error';
import { UndefinedStatementRouter } from "./Caixinha/routes/undefined_statement";
import { fetch_statements_router } from "./Caixinha/routes/fetch_statements";

const app = express();

app.set("trust proxy", true);
app.use(json());

// Use routes
app.use(signinRouter);
app.use(signupRouter);
app.use(caixinhaRouter);
app.use(UndefinedStatementRouter);
app.use(fetch_statements_router);


//We have installed a library to workaround the default pattern that
//JS deals with throw and async communication
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

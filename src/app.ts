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
import { userInfoRouter } from "./Caixinha/routes/user_info_feature";
import { caixinhaStatementsRouter } from "./Caixinha/routes/caixinha_statements";
import { notificationsRouter } from "./Notifications/routes/notifications"

const app = express();

app.set("trust proxy", true);
app.use(json());

// Use routes
app.use(signinRouter);
app.use(signupRouter);
app.use(caixinhaRouter);
app.use(UndefinedStatementRouter);
app.use(userInfoRouter);
app.use(caixinhaStatementsRouter);
app.use(notificationsRouter);

//We have installed a library to workaround the default pattern that
//JS deals with throw and async communication
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

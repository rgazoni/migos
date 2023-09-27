require("express-async-errors");
import express from "express";
import { json } from "body-parser";
import cors from "cors";

// Importing routes
import { signinRouter } from "./Auth/routes/signin";
import { signupRouter } from "./Auth/routes/signup";
import { caixinhaRouter } from "./Caixinha/routes/caixinha";
import { errorHandler } from './common/middlewares/error-handler';
import { NotFoundError } from './common/errors/not-found-error';


const app = express();

app.set("trust proxy", true);
app.use(json());

// Errors with credentials and CORS, refer to
// https://stackoverflow.com/questions/14003332/access-control-allow-origin-wildcard-subdomains-ports-and-protocols
// https://stackoverflow.com/questions/8074665/cross-origin-resource-sharing-with-credentials

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    origin: "http://localhost:3000",
    preflightContinue: true,
    credentials: true,
    exposedHeaders: ["set-cookie"],
    //allowedHeaders: ['Content-Type', 'Authorization']
  }),
);

// Use routes
app.use(signinRouter);
app.use(signupRouter);
app.use(caixinhaRouter);


//We have installed a library to workaround the default pattern that
//JS deals with throw and async communication
app.all('*', async (req, res) => {
  throw new NotFoundError();
});


app.use(errorHandler);

export { app };

import express, {Response, Request} from "express";

const router = express.Router();

router.get(
    "/users/caixinha/new",

    async (req: Request, res: Response) => {
        res.status(200).send(req.query);
    }
);

router.post(
    "/users/caixinha/new",

    async (req: Request, res: Response) => {
        res.status(200).send(req.body);
    }
);

export {router as newCaixinhaRouter};

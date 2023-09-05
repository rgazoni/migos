import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: [
                { msg: 'Email ou senha invalidos' },
                ...errors.array()
            ]
        });
    } else {
        next();
    }
}

import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

//When express identify a middleware with the following arguments
//it assumes that is a error handler by default
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() })
    }

    res.status(400).send({ errors: [ 
        { message: 'Something went wrong' }
    ]});

};
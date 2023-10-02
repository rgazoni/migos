export abstract class CustomError extends Error {
    //Writing abstract here if you extends CustomError, you gotta have statusCode implemented
    abstract statusCode: number;

    constructor (message: string) {
        super(message);
        //Only because we are extending a built in class
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): { message: string; field?: string }[]
}
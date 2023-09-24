import { CustomError } from "./custom-error";

export class InsertDatabaseError extends CustomError {
    statusCode = 500;

    constructor() {
        super('Could not insert a new user');
        Object.setPrototypeOf(this, InsertDatabaseError.prototype);
    }

    serializeErrors() {
        return [{ message: 'Could not insert a new user'}]
    }
}
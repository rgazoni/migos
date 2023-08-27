import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// scrypt by default operates with callbacks
// and as we want to create promises, we are using
// promisify to change this behavior
const scryptAsync = promisify(scrypt);

export class Password {

    // Static methods definitions means that we can access
    // them without instantiating Password class
    // For example Password.toHash('password');
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
        return buf.toString('hex') === hashedPassword;
    }
}
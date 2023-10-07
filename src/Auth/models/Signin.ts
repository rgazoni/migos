import { Password } from "../services/password";
import { DatabaseConnection } from "../../common/models/DatabaseConnection";
import { BadRequestError } from "../../common/errors/bad-request-error";
import { NotFoundError } from "../../common/errors/not-found-error";

class Signin extends DatabaseConnection{
    public async verifySignin(email: string, password: string){
        const user = await this.newQuery(`SELECT * FROM user_info WHERE email = '${email}'`);
        if (user.rows.length > 0) {
            const password_db = user.rows[0].password;
            const isPasswordCorrect = await Password.compare(password_db, password);
            if (isPasswordCorrect) {
                return user.rows[0].user_id;
            } else {
                throw new BadRequestError("Incorrect password");
            }
        }else{
            throw new NotFoundError();    
        }
    }     
}
export { Signin };
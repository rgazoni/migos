import { Password } from "../services/password";
import { DatabaseConnection } from "../../common/models/DatabaseConnection";
import { BadRequestError } from "../../common/errors/bad-request-error";

class Signin extends DatabaseConnection{
    public async verifySignin(email: string, password: string){
        const user = await this.newQuery(`SELECT * FROM user_accounts WHERE email = '${email}'`);
        if (user.rows.length > 0) {
            const password_db = user.rows[0].password;
            const isPasswordCorrect = await Password.compare(password_db, password);
            if (isPasswordCorrect) {
                return user.rows[0].user_id;
            } else {
                throw new BadRequestError("Senha incorreta");
            }
        }else{
            throw new BadRequestError("Email incorreto");
        }
    }     
}
export { Signin };
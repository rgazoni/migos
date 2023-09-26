import { Password } from "../services/password";
import { DatabaseConnection } from "../../common/models/DatabaseConnection";

class Signin extends DatabaseConnection{
    public async verifySignin(email: string, password: string){
        const user = await this.newQuery(`SELECT * FROM user_info WHERE email = '${email}'`);
        if(user.rows.length > 0){
            const password_db = user.rows[0].password;
            const isPasswordCorrect = await Password.compare(password_db, password);
            if (isPasswordCorrect) {
                console.log("user found.");
                return user;
            } else {
                console.log("Incorrect password.");
                return false;
            }
        }else{
            console.log("User not found");
            return false;
        }
    }     
}
export { Signin };
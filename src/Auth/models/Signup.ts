import { v4 as uuid4 } from 'uuid';
import { Password } from "../services/password";
import { InternalServerError } from "../../common/errors/internal-server-error";
import { DatabaseConnection } from "../../common/models/DatabaseConnection"

class Signup extends DatabaseConnection{
    public async exists(email: string){
        const db_email = await this.newQuery(`SELECT * FROM user_info WHERE email = '${email}'`);

        if(db_email.rows.length == 0)
            return false;

        return true;
    }

    public async create(email: string, password: string, birth_date: string, first_name: string, last_name: string){
        const user_id = uuid4();
        const hashedPassword = await Password.toHash(password);
        const response = await this.newQuery(`INSERT INTO user_info (user_id, email, birthdate, first_name, last_name, password)
                                                VALUES ('${user_id}', '${email}', '${birth_date}', '${first_name}', '${last_name}', '${hashedPassword}')`);

        if(response.rowCount == 0){
            throw new InternalServerError('Algo deu errado');
        }
    } 
}

export { Signup };

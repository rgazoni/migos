import { uuid } from "uuidv4";
import { DatabaseConnection } from "../../common/models/DatabaseConnection";
import { BadRequestError } from "../../common/errors/bad-request-error";
import { InternalServerError } from "../../common/errors/internal-server-error";

class Caixinhas extends DatabaseConnection{
    public async createCaixinha(caixinha_name: string, tag: string, default_amount: number, user_id: string){
        const caixinha_ID = uuid();
        const caixinha = await this.newQuery(`SELECT * FROM user_caixinhas WHERE user_id = '${user_id}' AND caixinha_name = '${caixinha_name}'`);
        if(caixinha.rows.length>0){
            throw new BadRequestError("Já existe uma caixinha com este nome");
        }else{
            const response = await this.newQuery(`INSERT INTO user_caixinhas (caixinha_id, caixinha_name, tag, default_amount, user_id)
                                                VALUES ('${caixinha_ID}', '${caixinha_name}', '${tag}', '${default_amount}', '${user_id}')`);
            
            const caixinha_tag = await this.newQuery(`INSERT INTO caixinha_tags (caixinha_id, tag, related_tags, user_id)
                                                         VALUES ('${caixinha_ID}', '${tag}', '${''}', '${user_id}')`);   
        }
    }
    
    public async fetchUserCaixinhas(user_id: string){
        const allCaixinhas = await this.newQuery(`SELECT * FROM user_caixinhas where user_id = '${user_id}'`);
        if(allCaixinhas.rows.length > 0) {
            return allCaixinhas.rows;
        }else{
            throw new InternalServerError('ID não encontrado'); 
        }
    
    }    
}
export { Caixinhas }

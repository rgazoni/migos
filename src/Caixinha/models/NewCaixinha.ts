import { uuid } from "uuidv4";
import { DatabaseConnection } from "../../common/models/DatabaseConnection";

class NewCaixinha extends DatabaseConnection{
    public async createCaixinha(caixinha_name: string, tag: string, default_amount: number, user_id: string){
        const caixinha_ID = uuid();
        const caixinha = await this.newQuery(`SELECT * FROM user_caixinhas WHERE user_id = '${user_id}' AND caixinha_name = '${caixinha_name}'`);
        if(caixinha.rows.length>0){
            console.log("este usuario ja possui uma caixinha com esse nome");
        }else{
            const response = await this.newQuery(`INSERT INTO user_caixinhas (caixinha_id, caixinha_name, tag, default_amount, user_id)
                                                VALUES ('${caixinha_ID}', '${caixinha_name}', '${tag}', '${default_amount}', '${user_id}')`);
            
            const caixinha_tag = await this.newQuery(`INSERT INTO caixinha_tags (caixinha_id, tag, related_tags, user_id)
                                                         VALUES ('${caixinha_ID}', '${tag}', '${''}', '${user_id}')`);   
        }
    }
    
    public async returnCaixinhas(user_id: string){
        const allCaixinhas = await this.newQuery(`SELECT * FROM user_caixinhas where user_id = '${user_id}'`);
        return allCaixinhas.rows;
    }    
}
export { NewCaixinha }
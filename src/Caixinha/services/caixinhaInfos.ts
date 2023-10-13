import { DatabaseConnection } from "../../common/models/DatabaseConnection";
import { NewCaixinha } from "../models/NewCaixinha";

class CaixinhasInfo extends DatabaseConnection{
    public async getCaixinhas(user_id: string) {
        const newCaixinha = new NewCaixinha();
        const caixinhas = await newCaixinha.returnCaixinhas(user_id);
        return caixinhas;
    }
}
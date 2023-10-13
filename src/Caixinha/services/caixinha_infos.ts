import { Caixinhas } from "../models/Caixinhas";

class CaixinhaInfos{
    public async getCaixinhas(user_id: string) {
        const Caixinha = new Caixinhas();
        const caixinhas = await Caixinha.fetchUserCaixinhas(user_id);
        return caixinhas;
    }
}
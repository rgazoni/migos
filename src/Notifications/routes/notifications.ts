import express, { Response, Request } from 'express';
import { CaixinhaInfos } from '../../Caixinha/services/caixinha_infos';

const router = express.Router();

router.get(
    '/api/users/notifications/:user_id',
    async (req: Request, res: Response) => {

        const user_id = req.params.user_id;

        const user_info = new CaixinhaInfos();
        const all_info = await user_info.compute_caixinha_spends(user_id);

        const notify: any[] = [];
        all_info.info_per_caixinha.map( (caixinha) => {
            if (caixinha.total_amount > caixinha.default_amount) {
                notify.push({
                    tag: caixinha.tag,
                    caixinha_name: caixinha.caixinha_name,
                    percentage: 1,
                    total_left: -1
                })
            }
            else if (caixinha.total_amount >= caixinha.default_amount * 0.9) {
                notify.push({
                    tag: caixinha.tag,
                    caixinha_name: caixinha.caixinha_name,
                    percentage: 0.9,
                    total_left: caixinha.total_left
                })
            }
            else if (caixinha.total_amount >= caixinha.default_amount * 0.5) {
                notify.push({
                    tag: caixinha.tag,
                    caixinha_name: caixinha.caixinha_name,
                    percentage: 0.5,
                    total_left: caixinha.total_left
                })
            }
            else if (caixinha.total_amount >= caixinha.default_amount * 0.1) {
                notify.push({
                    tag: caixinha.tag,
                    caixinha_name: caixinha.caixinha_name,
                    percentage: 0.1,
                    total_left: caixinha.total_left
                })
            }
        } )

        // console.log(all_info);

        res.status(200).json({ results: notify }); 
    }
);

export { router as notificationsRouter };

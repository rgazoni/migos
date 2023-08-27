import { app } from './app';
import 'dotenv/config';

const start = async () => {

    try {
        //Insert database RDS connection here
        //console.log('Connected to RDS AWS database');
    } catch (err) {
        //console.log(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!');
    });
};

start();
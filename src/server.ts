import 'dotenv/config';
import App from './app';
import AppRoute from './api/app.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new AppRoute()]);

app.listen();

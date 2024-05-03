import express, { Express } from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dbConnection from './config/dbConnection';

import { basicAuthRouter } from './routes/usersRoutes';
import { globalRouter } from './routes';

const app: Express = express();

dotenv.config();
dbConnection();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(globalRouter);
app.use(basicAuthRouter);

export default app;

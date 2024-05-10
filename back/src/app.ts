import express, { Express } from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dbConnection from './config/dbConnection';
import cors from 'cors';

import { basicAuthRouter } from './routes/usersRoutes';
import { globalRouter } from './routes';
import {profileRouter} from './routes/profileRoutes';
import {productsRouter} from './routes/productsRoutes';

const app: Express = express();

dotenv.config();
dbConnection();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(globalRouter);
app.use(basicAuthRouter);
app.use(profileRouter);
app.use(productsRouter);

export default app;

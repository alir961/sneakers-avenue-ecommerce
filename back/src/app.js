const logger = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const indexRouter = require('./routes/index');
const dbConnection = require('./config/dbConnection');
const userRoutes = require('./routes/users.routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use('/api/auth', userRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', indexRouter);
dotenv.config();

dbConnection();

module.exports = app;

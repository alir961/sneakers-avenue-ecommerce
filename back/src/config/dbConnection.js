const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const dbConnection = async () => {
  try {
    const con = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = dbConnection;

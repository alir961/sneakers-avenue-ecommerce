import mongoose, { Mongoose } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
    throw new Error('MONGODB_URI is not defined. Please set it in your environment variables.');
}

const dbConnection = async (): Promise<void> => {
    try {
        const con: Mongoose = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${con.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
        } else {
            console.error('Unknown error connecting to MongoDB');
        }
        throw error;
    }
};

export default dbConnection;

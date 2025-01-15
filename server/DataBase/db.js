import { connect } from 'mongoose';
import { DB_Name } from '../constant.js';

const connectDB = async () => {
    try {
        await connect(`${process.env.MONGO_URI}/${DB_Name}` || "mongodb://localhost:27017/chatapp");
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;

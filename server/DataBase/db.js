import { connect } from 'mongoose';


const connectDB = async () => {
    try {
        await connect("mongodb://localhost:27017/chatapp");
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;

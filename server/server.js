import express from 'express';
import connectDB from './DataBase/db.js';
import userRouter from './routes/userRoute.js';
import dotenv from "dotenv"

dotenv.config()
const app = express();
const port = 3000;
connectDB()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api/v1/user", userRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
import express from 'express';
import connectDB from './DataBase/db.js';
import userRouter from './routes/userRoute.js';
import chatRouter from "./routes/chatRoute.js"
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
app.use("/api/v1/chat", chatRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
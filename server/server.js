import express from 'express';
import connectDB from './DataBase/db.js';
import userRouter from './routes/userRoute.js';
import chatRouter from "./routes/chatRoute.js";
import messageRouter from "./routes/messageRoute.js"
import dotenv from "dotenv"
import cors from "cors"
import { app, server } from "./utils/socket.js";

dotenv.config()
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
const port = 3000;
connectDB()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter)

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
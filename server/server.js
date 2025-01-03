import express from 'express';
import connectDB from './DataBase/db.js';
import userRouter from './routes/userRoute.js';

const app = express();
const port = 3000;
connectDB()



app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api/user", userRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
import { Router } from 'express';
import { registerUser, loginUser, allUsers } from '../controllers/userController.js';

const userRouter = Router();


userRouter.route("/register").post(registerUser);
userRouter.route("/allusers").get(allUsers);
userRouter.route("/login").post(loginUser);



export default userRouter;
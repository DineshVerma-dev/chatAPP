import { Router } from 'express';
import { registerUser, loginUser, allUsers } from '../controllers/userController.js';

const router = Router();


router.route("/register").post(registerUser);
router.route("/allusers").get(allUsers);
router.route("/login").post(loginUser);



export default router;
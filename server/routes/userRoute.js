import { Router } from 'express';
import { registerUser, loginUser, getUserProfile, allUsers } from '../controllers/userController.js';

const router = Router();


router.route("/register").post(registerUser);
router.route("/allusers").get(allUsers);
router.route("/login").post(loginUser);
router.get('/profile', getUserProfile);


export default router;
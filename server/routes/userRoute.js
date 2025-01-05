import { Router } from 'express';
import { registerUser, loginUser, getUserProfile, allUsers } from '../controllers/userController.js';

const router = Router();


router.route("/register").post(registerUser).get(allUsers);
router.route("/login").post(loginUser).get(allUsers);
router.get('/profile', getUserProfile);


export default router;
import { Router } from "express";
import { allMessages, sendMessage } from "../controllers/messageController.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
const router = Router();

router.route("/").get( jwtAuthMiddleware,allMessages);
router.route("/send").post( jwtAuthMiddleware,sendMessage);

export default router;
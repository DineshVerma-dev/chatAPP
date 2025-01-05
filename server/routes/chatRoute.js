import { Router } from 'express';
import { accessChat, allChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } from "../controllers/chatController.js"
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js"
const router = Router();


router.route("/").post(jwtAuthMiddleware, accessChat)
router.route("/").get(allChats)
router.route("/group").post(createGroupChat)
router.route("/rename").put(renameGroup)
router.route("/groupremove").put(removeFromGroup)
router.route("/groupadd").put(addToGroup)



export default router;
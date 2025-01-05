import { Router } from 'express';
import { accessChat, allChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } from "../controllers/chatController.js"
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js"
const router = Router();


router.route("/").post(jwtAuthMiddleware, accessChat)
router.route("/").get(jwtAuthMiddleware,allChats)
router.route("/group").post(createGroupChat)
router.route("/rename").put(renameGroup)
router.route("/removefromgroup").put(removeFromGroup)
router.route("/addtogroup").put(addToGroup)



export default router;
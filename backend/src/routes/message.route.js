import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controller/message.controller.js";


const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar)

router.get("/:id",protectRoute, getMessages) // here id is a route parameter i.e, it is not static it is dynamic that means it can change according to oour code

router.post("/send/:id",protectRoute, sendMessage)
export default router;
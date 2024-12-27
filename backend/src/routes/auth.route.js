import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile",protectRoute, updateProfile); // we will first check if the user is verified and logged in or not and then only proceed to update the profile 

router.get("/check",protectRoute,checkAuth);

export default router;
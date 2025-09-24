// auth.routes.js
import express from "express";
import { register, login } from "./auth.controller.js";

const router = express.Router();

router.post("/register", register);
// router.get("/registered-users", getRegisteredUsers);  // Get all registered users
router.post("/login", login);

export default router;

import { Router } from "express";
import { register, login, getme } from "../controller/auth.controller.js";
import protect from "../middleware/protect.js";
const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", protect, getme);

export default authRoutes;

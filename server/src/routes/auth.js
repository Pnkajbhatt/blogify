import { Router } from "express";
import { register, login, getme } from "../controller/auth.controller.js";
import protect from "../middleware/protect.js";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../validation/auth.validation.js";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), register);
authRoutes.post("/login", validate(loginSchema), login);
authRoutes.get("/me", protect, getme);

export default authRoutes;

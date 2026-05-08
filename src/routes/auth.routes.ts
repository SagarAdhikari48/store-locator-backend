import { Router } from "express";
import {
  getAllUsers,
  login,
  registerUser,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerUser);

router.get("/users", getAllUsers);

router.post("/login", login);

export default router;

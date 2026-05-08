import { Router } from "express";
import {
  getAllBusiness,
  createBusiness,
} from "../controllers/business.controller.js";
import { authMiddlewares } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/businesses", getAllBusiness);

router.post("/register", authMiddlewares, createBusiness);

export default router;

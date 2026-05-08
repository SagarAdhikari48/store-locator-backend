import { Router } from "express";
import {
  getAllBusiness,
  createBusiness,
} from "../controllers/business.controller.js";

const router = Router();

router.get("/businesses", getAllBusiness);

router.post("/register", createBusiness);

export default router;

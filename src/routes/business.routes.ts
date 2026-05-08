import { Router } from "express";
import {
  getAllBusiness,
  createBusiness,
} from "../controllers/business.controller.js";
import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { allowRoles } from "../middlewares/role.middlewares.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createBusinessSchema } from "../schema/business.schema.js";

const router = Router();

router.get("/businesses", getAllBusiness);

router.post(
  "/register",
  authMiddlewares,
  allowRoles("OWNER", "ADMIN"),
  validate(createBusinessSchema),
  createBusiness,
);

export default router;

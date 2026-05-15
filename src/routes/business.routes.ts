import { Router } from "express";
import {
  getAllBusiness,
  createBusiness,
  getBusinessById,
  getMyBusinesses,
  deleteBusiness,
  updateBusiness,
} from "../controllers/business.controller.js";
import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { allowRoles } from "../middlewares/role.middlewares.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createBusinessSchema,
  updateBusinessSchema,
} from "../schema/business.schema.js";

const router = Router();

router.get("/all", getAllBusiness);

router.post(
  "/register",
  authMiddlewares,
  allowRoles("OWNER", "ADMIN"),
  validate(createBusinessSchema),
  createBusiness,
);

router.get(
  "/my",
  authMiddlewares,
  allowRoles("OWNER", "ADMIN"),
  getMyBusinesses,
);
router.get("/:id", getBusinessById);

router.patch(
  "/:id",
  authMiddlewares,
  allowRoles("OWNER", "ADMIN"),
  validate(updateBusinessSchema),
  updateBusiness,
);

router.delete(
  "/:id",
  authMiddlewares,
  allowRoles("OWNER", "ADMIN"),
  deleteBusiness,
);
export default router;

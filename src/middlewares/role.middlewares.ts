import type { Response, NextFunction } from "express";
import type { AuthRequest, JwtPayload } from "./auth.middlewares.js";

type Role = JwtPayload["role"];

export const allowRoles =
  (...roles: Role[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permission",
      });
    }

    next();
  };

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";

export interface JwtPayload {
  userId: string;
  role: "CUSTOMER" | "OWNER" | "ADMIN";
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddlewares = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    return res.status(401).json({
      message: "Authorization token is missing!",
    });
  }

  const token = authHeaders.split(" ")[1];

  try {
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!)! as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({
      message: "Invalid or Expired token!",
    });
  }
};

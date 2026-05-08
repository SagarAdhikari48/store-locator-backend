import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middlewares.js";
import type { CreateBusinessInput } from "../schema/business.schema.js";

export const getAllBusiness = async (req: Request, res: Response) => {
  try {
    const businesses = await prisma.business.findMany();
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch businesses!" });
  }
};

export const createBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, latitude, longitude, address } =
      req.body as CreateBusinessInput;
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }

    const business = await prisma.business.create({
      data: {
        name,
        type,
        latitude,
        longitude,
        address,
        ownerId: req.user?.userId,
      },
    });
    res.status(201).json({
      message: "Business created successfully",
      data: business,
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to create business !: ${error}` });
  }
};

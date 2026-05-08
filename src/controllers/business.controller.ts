import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export const getAllBusiness = async (req: Request, res: Response) => {
  try {
    const businesses = await prisma.business.findMany();
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch businesses!" });
  }
};

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const { name, type, latitude, longitude, address, ownerId } = req.body;

    const business = await prisma.business.create({
      data: {
        name,
        type,
        latitude,
        longitude,
        address,
        ownerId,
      },
    });
    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({ error: `Failed to create business !: ${error}` });
  }
};

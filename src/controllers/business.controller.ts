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

export const getMyBusinesses = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }

  try {
    const businesses = await prisma.business.findMany({
      where: {
        ownerId: req.user?.userId,
      },
    });
    res.json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch my businesses!" });
  }
};

export const getBusinessById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const business = await prisma.business.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!business) {
      return res.status(404).json({ error: "Business not found!" });
    }
    res.json({
      success: true,
      data: business,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch business!" });
  }
};

export const updateBusiness = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const business = await prisma.business.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!business) {
      return res.status(404).json({ error: "Business not found!" });
    }
    if (business.ownerId !== req.user?.userId) {
      return res.status(403).json({ error: "Forbidden!" });
    }

    const updatedBusiness = await prisma.business.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });
    res.json({
      message: "Business updated successfully",
      data: updatedBusiness,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update business!" });
  }
};

export const deleteBusiness = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const business = await prisma.business.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!business) {
      return res.status(404).json({ error: "Business not found!" });
    }
    if (business.ownerId !== req.user?.userId) {
      return res
        .status(403)
        .json({
          error: "Forbidden!",
          message: "You are not allowed to update this business",
        });
    }

    await prisma.business.delete({
      where: {
        id: Number(id),
      },
    });
    res.json({
      message: "Business deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete business!" });
  }
};

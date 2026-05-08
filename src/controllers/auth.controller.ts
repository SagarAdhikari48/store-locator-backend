import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import { z } from "zod";
import type { User } from "@prisma/client";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["CUSTOMER", "OWNER"]).default("CUSTOMER"),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.send(users);
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });
    res
      .status(201)
      .json({ message: "User registered Successfully", userId: user.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed!", error: err.issues });
    }
    res.status(500).json({ error: `Something went wrong! ${err}` });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const user: Partial<User> = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password!);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed!",
        errors: err.issues,
      });
    }
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

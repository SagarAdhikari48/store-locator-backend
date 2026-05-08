import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["CUSTOMER", "OWNER"]).default("CUSTOMER"),
});

router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

router.post("/register", async (req, res) => {
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
});

export default router;

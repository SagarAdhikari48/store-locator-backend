import express from "express";
import cors from "cors";
import { prisma } from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import businessRoutes from "./routes/business.routes.js";

const app = express();

console.log("Express app loaded");

app.use(cors());
app.use(express.json());

//Mount the routes here
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Restaurant Store API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.get("/api/users", async (req, res) => {
  const users = await prisma.user.findMany();
});

export default app;

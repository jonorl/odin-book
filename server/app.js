import "dotenv/config";
import express from "express";
import cors from "cors";
import seeds from "./prisma/seeds.js";
import mainRouter from "./routes/mainRouter.js";

// Config

// Express setup
const app = express();

// CORS setup
app.use(cors());
app.use(express.json());

// Router triggering
app.use("/", mainRouter);

// Generate random users
// seeds();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Launch and port confirmation
app.listen(process.env.PORT, () =>
  console.log(`Listeining on port ${process.env.PORT}`)
);

export default app;

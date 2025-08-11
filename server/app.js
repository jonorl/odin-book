console.log('Starting app.js...');
import "dotenv/config";
import express from "express";
console.log('Express loaded');
import cors from "cors";
import session from "express-session";
import apiRouter from "./routes/index.js";
// import mainRouter from "./routes/mainRouter.js";

// Config

// Express setup
const app = express();

// CORS setup
app.use(cors());
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Router triggering
// app.use("/", mainRouter);

// uncomment this when migrating to split routers
// app.use("/api/v1", apiRouter);

// Generate random users
// seeds();

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// Launch and port confirmation
const PORT = process.env.PORT || 8080
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Listeining on port ${PORT}`)
);

export default app;

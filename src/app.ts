import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "node:path";
import cors from "cors"
import { envVars } from "./config/env";

const app: Application = express();

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

// Standard Middlewares
app.use(cors({
  origin: envVars.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Auth Middleware (Better-Auth)
app.use("/api/auth", toNodeHandler(auth));

// API Routes
app.use("/api/v1", IndexRoutes);

// Health Check / Root Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Green Pulse API",
    version: "1.0.0",
    environment: envVars.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error Handling
app.use(globalErrorHandler);
app.use(notFound);

export default app;

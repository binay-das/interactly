import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import { API_PREFIX } from "./config/constants.js";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import apiRouter from "./routes/index.js";

const app: Application = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(API_PREFIX, apiRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;

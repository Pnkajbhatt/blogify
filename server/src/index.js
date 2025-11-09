import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postroute from "./routes/post.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/post", postroute);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is LIVE!" });
});

app.post("/api/data", (req, res) => {
  res.json({ message: "API working!" });
});

app.listen(process.env.PORT, () =>
  console.log(`Server on ${process.env.PORT}`)
);

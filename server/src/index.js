import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is LIVE!" });
});

app.post("/api/data", (req, res) => {
  res.json({ message: "API working!" });
});
app.listen(process.env.PORT, () =>
  console.log(`Server on ${process.env.PORT}`)
);

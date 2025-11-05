require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const connectDB = require("./config/db.js");

app.use(helmet());
app.use(cors());
app.use(express.json());

connectDB();

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is LIVE!" });
});

app.post("/api/data", (req, res) => {
  res.json({ message: "API working!" });
});
app.listen(process.env.PORT, () =>
  console.log(`Server on ${process.env.PORT}`)
);

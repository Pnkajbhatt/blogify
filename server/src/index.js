require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error(err));
app.get("/", (req, res) => res.send("Blogify API"));
app.listen(process.env.PORT, () =>
  console.log(`Server on ${process.env.PORT}`)
);

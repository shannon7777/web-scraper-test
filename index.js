const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 5050;

dotenv.config();
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to web scraper test" });
});

app.listen(PORT, () => console.log(`This server is running on PORT:${PORT}`));

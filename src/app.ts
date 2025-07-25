import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3202;

app.get("/", (req, res) => {
  res.send("Flight Connector API is running!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

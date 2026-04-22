require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// test route
app.post("/test", (req, res) => {
  res.send("TEST WORKING");
});

// routes
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");

app.use("/api", authRoutes);
app.use("/api", expenseRoutes);

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// server start
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
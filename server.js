require("dotenv").config();

const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const { testAI } = require("./services/aiService");

const app = express();

connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ai-interview-platform-gamma-beryl.vercel.app/"  
    
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interviews", interviewRoutes);

// ✅ TEST AI HERE
// testAI();

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// ✅ FIRST LINE - before everything else
const dotenv = require("dotenv");
dotenv.config();

// Now all process.env vars are available for everything below
const express = require("express");
const cors = require("cors");
//const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");



const connectDB = require("./src/config/db");

// BE Dev 1 Routes
const authRoutes = require("./src/routes/auth.routes");
const resumeRoutes = require("./src/routes/resume.routes");
const historyRoutes = require("./src/routes/history.routes");

// BE Dev 2 Routes
const jdRoutes = require("./src/routes/jd.routes");
const interviewRoutes = require("./src/routes/interview.routes");
const linkedinRoutes = require("./src/routes/linkedin.routes");

// Middleware
const { errorHandler, notFound } = require("./src/middleware/errorHandler");
const { apiLimiter } = require("./src/middleware/rateLimiter");
const skillGapRoutes = require("./src/routes/skillGap.routes");
const app = express();


app.use("/uploads", express.static("uploads"));
// Connect to MongoDB
connectDB();

app.use(cors({
  origin: ["http://localhost:5173", "https://rozgaar-ai-seven.vercel.app"],
  credentials: true,
}));
// Core Middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", apiLimiter);
app.use("/api/skill-gap", skillGapRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "RozgaarAI Backend is running 🚀" });
});

// BE Dev 1 Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/history", historyRoutes);

// BE Dev 2 Routes
app.use("/api/jd", jdRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/linkedin", linkedinRoutes);

// Error Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
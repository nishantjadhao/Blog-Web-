const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./lib/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

// Upload Folder Access
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", authRoutes);

app.use("/api/posts", postRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
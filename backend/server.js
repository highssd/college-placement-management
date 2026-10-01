require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();


// Connect MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(express.json());


// Home
app.get("/", (req, res) => {
    res.json({
        message: "College Placement Management System API is running"
    });
});


// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        service: "placement-management-backend"
    });
});


// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});
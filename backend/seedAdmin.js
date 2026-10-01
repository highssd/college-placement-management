require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

async function seedAdmin() {
    try {
        await connectDB();

        const email = "admin@college.com";

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        await User.create({
            name: "Placement Administrator",
            usn: "ADMIN001",
            email: email,
            password: hashedPassword,
            branch: "CSE",
            cgpa: 10,
            skills: ["Management"],
            role: "admin"
        });

        console.log("Admin account created successfully.");
        console.log("Email: admin@college.com");
        console.log("Password: Admin@123");

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
}

seedAdmin();
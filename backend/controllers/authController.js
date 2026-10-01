const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(user) {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
}

function publicUser(user) {
    return {
        id: user._id,
        name: user.name,
        usn: user.usn,
        email: user.email,
        branch: user.branch,
        cgpa: user.cgpa,
        skills: user.skills,
        role: user.role
    };
}


// STUDENT REGISTRATION
async function register(req, res) {
    try {
        const {
            name,
            usn,
            email,
            password,
            branch,
            cgpa,
            skills
        } = req.body;

        // Check required fields
        if (
            !name ||
            !usn ||
            !email ||
            !password ||
            !branch ||
            cgpa === undefined
        ) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        // Check whether email or USN already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { usn: usn.toUpperCase() }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email or USN already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Convert skills to array
        let skillArray = [];

        if (Array.isArray(skills)) {
            skillArray = skills;
        } else if (skills) {
            skillArray = String(skills)
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);
        }

        // Create student
        const user = await User.create({
            name,
            usn,
            email,
            password: hashedPassword,
            branch,
            cgpa: Number(cgpa),
            skills: skillArray,
            role: "student"
        });

        res.status(201).json({
            message: "Registration successful",
            token: createToken(user),
            user: publicUser(user)
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
}


// LOGIN
async function login(req, res) {
    try {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email: email?.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            token: createToken(user),
            user: publicUser(user)
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
}


// GET CURRENT USER
async function getMe(req, res) {
    res.json({
        user: req.user
    });
}


module.exports = {
    register,
    login,
    getMe
};
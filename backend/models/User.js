const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        usn: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        branch: {
            type: String,
            required: true
        },

        cgpa: {
            type: Number,
            required: true,
            min: 0,
            max: 10
        },

        skills: [
            {
                type: String
            }
        ],

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
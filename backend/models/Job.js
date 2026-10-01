const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            required: true,
            trim: true
        },

        packageLPA: {
            type: Number,
            required: true,
            min: 0
        },

        minimumCGPA: {
            type: Number,
            required: true,
            min: 0,
            max: 10
        },

        branches: [
            {
                type: String,
                trim: true
            }
        ],

        skills: [
            {
                type: String,
                trim: true
            }
        ],

        description: {
            type: String,
            default: ""
        },

        deadline: {
            type: Date,
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);
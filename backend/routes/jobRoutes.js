const express = require("express");

const {
    getJobs,
    createJob,
    deleteJob
} = require("../controllers/jobController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get all jobs
router.get(
    "/",
    protect,
    getJobs
);


// Create job - Admin only
router.post(
    "/",
    protect,
    adminOnly,
    createJob
);


// Delete job - Admin only
router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteJob
);


module.exports = router;
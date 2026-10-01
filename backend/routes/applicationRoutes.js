const express = require("express");

const {
    applyForJob,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


/* STUDENT */

router.get(
    "/my",
    protect,
    getMyApplications
);


router.post(
    "/:jobId",
    protect,
    applyForJob
);


/* ADMIN */

router.get(
    "/all",
    protect,
    adminOnly,
    getAllApplications
);


router.patch(
    "/:id/status",
    protect,
    adminOnly,
    updateApplicationStatus
);


module.exports = router;
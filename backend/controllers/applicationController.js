const Application = require("../models/Application");
const Job = require("../models/Job");

async function applyForJob(req, res) {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (req.user.cgpa < job.minimumCGPA) {
            return res.status(400).json({
                message: "You are not eligible based on CGPA"
            });
        }

        if (
            job.branches.length > 0 &&
            !job.branches.some(
                branch =>
                    branch.toLowerCase() ===
                    req.user.branch.toLowerCase()
            )
        ) {
            return res.status(400).json({
                message: "You are not eligible for this branch"
            });
        }

        if (new Date() > new Date(job.deadline)) {
            return res.status(400).json({
                message: "Application deadline has passed"
            });
        }

        const existingApplication = await Application.findOne({
            student: req.user._id,
            job: job._id
        });

        if (existingApplication) {
            return res.status(409).json({
                message: "You have already applied for this job"
            });
        }

        const application = await Application.create({
            student: req.user._id,
            job: job._id,
            status: "Applied"
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
}


async function getMyApplications(req, res) {
    try {
        const applications = await Application.find({
            student: req.user._id
        })
            .populate(
                "job",
                "companyName role packageLPA minimumCGPA deadline"
            )
            .sort({
                createdAt: -1
            });

        res.json(applications);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}


/* ADMIN: GET ALL APPLICATIONS */

async function getAllApplications(req, res) {
    try {

        const applications = await Application.find()
            .populate(
                "student",
                "name usn email branch cgpa"
            )
            .populate(
                "job",
                "companyName role packageLPA"
            )
            .sort({
                createdAt: -1
            });

        res.json(applications);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}


/* ADMIN: UPDATE APPLICATION STATUS */

async function updateApplicationStatus(req, res) {
    try {

        const allowedStatuses = [
            "Applied",
            "Under Review",
            "Shortlisted",
            "Interview",
            "Selected",
            "Rejected"
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const application =
            await Application.findByIdAndUpdate(
                req.params.id,
                {
                    status
                },
                {
                    new: true
                }
            )
            .populate(
                "student",
                "name usn email branch cgpa"
            )
            .populate(
                "job",
                "companyName role packageLPA"
            );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: "Application status updated successfully",
            application
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}


module.exports = {
    applyForJob,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus
};
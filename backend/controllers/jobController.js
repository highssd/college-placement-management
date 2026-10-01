const Job = require("../models/Job");
const Application = require("../models/Application");


// Convert comma-separated values into an array
function normalizeArray(value) {

    if (Array.isArray(value)) {
        return value
            .map(String)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}


// Check student eligibility
function isEligible(user, job) {

    const branchMatch =
        job.branches.length === 0 ||
        job.branches.some(
            (branch) =>
                branch.toLowerCase() ===
                user.branch.toLowerCase()
        );

    return (
        user.cgpa >= job.minimumCGPA &&
        branchMatch
    );
}


// GET ALL JOBS
async function getJobs(req, res) {

    try {

        const jobs = await Job
            .find()
            .sort({ createdAt: -1 });


        let applications = [];

        if (req.user?.role === "student") {

            applications = await Application
                .find({
                    student: req.user._id
                })
                .select("job");
        }


        const appliedJobIds = new Set(
            applications.map(
                (application) =>
                    String(application.job)
            )
        );


        const result = jobs.map((job) => ({

            ...job.toObject(),

            eligible:
                req.user?.role === "student"
                    ? isEligible(req.user, job)
                    : null,

            applied:
                req.user?.role === "student"
                    ? appliedJobIds.has(
                        String(job._id)
                    )
                    : null
        }));


        res.json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}


// CREATE JOB
async function createJob(req, res) {

    try {

        const {
            companyName,
            role,
            packageLPA,
            minimumCGPA,
            branches,
            skills,
            description,
            deadline
        } = req.body;


        if (
            !companyName ||
            !role ||
            packageLPA === undefined ||
            minimumCGPA === undefined ||
            !deadline
        ) {

            return res.status(400).json({
                message:
                    "Required job fields are missing"
            });
        }


        const job = await Job.create({

            companyName,

            role,

            packageLPA:
                Number(packageLPA),

            minimumCGPA:
                Number(minimumCGPA),

            branches:
                normalizeArray(branches),

            skills:
                normalizeArray(skills),

            description,

            deadline,

            createdBy:
                req.user._id
        });


        res.status(201).json(job);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}


// DELETE JOB
async function deleteJob(req, res) {

    try {

        const job =
            await Job.findByIdAndDelete(
                req.params.id
            );


        if (!job) {

            return res.status(404).json({
                message: "Job not found"
            });
        }


        // Delete applications related to this job
        await Application.deleteMany({
            job: job._id
        });


        res.json({
            message: "Job deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}


module.exports = {

    getJobs,
    createJob,
    deleteJob,
    isEligible

};
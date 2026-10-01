import { useEffect, useState } from "react";

import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import AdminLogin from "./pages/AdminLogin";

import "./App.css";


const API = "http://localhost:5000";


/* =========================
   HOME PAGE
========================= */

function Home({ setPage }) {

    return (
        <div className="app">

            <nav className="navbar">

                <h1>
                    College Placement Management System
                </h1>

                <div>

                    <button
                        className="nav-button"
                        onClick={() => setPage("student-login")}
                    >
                        Student Login
                    </button>

                    <button
                        className="nav-button register"
                        onClick={() => setPage("register")}
                    >
                        Register
                    </button>

                    <button
                        className="nav-button admin-nav"
                        onClick={() => setPage("admin-login")}
                    >
                        Admin Login
                    </button>

                </div>

            </nav>


            <section className="hero">

                <div className="hero-content">

                    <h2>
                        Smart College Placement Management
                    </h2>

                    <p>
                        A MERN stack based platform that connects
                        students, placement administrators and
                        recruitment opportunities in one system.
                    </p>

                    <div className="buttons">

                        <button
                            className="primary-button"
                            onClick={() => setPage("student-login")}
                        >
                            Student Login
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => setPage("register")}
                        >
                            Create Account
                        </button>

                    </div>

                </div>

            </section>


            <section className="features">

                <div className="feature-card">
                    <h3>Student Management</h3>
                    <p>
                        Students can create profiles containing
                        branch, CGPA and technical skills.
                    </p>
                </div>


                <div className="feature-card">
                    <h3>Job Opportunities</h3>
                    <p>
                        Students can view placement opportunities
                        posted by the administrator.
                    </p>
                </div>


                <div className="feature-card">
                    <h3>Eligibility Checking</h3>
                    <p>
                        The system automatically checks CGPA and
                        branch eligibility.
                    </p>
                </div>


                <div className="feature-card">
                    <h3>Application Tracking</h3>
                    <p>
                        Students can track application progress
                        from Applied to Selected or Rejected.
                    </p>
                </div>

            </section>


            <footer className="footer">
                <p>
                    College Placement Management System | MERN Stack
                </p>
            </footer>

        </div>
    );
}



/* =========================
   STUDENT DASHBOARD
========================= */

function StudentDashboard({ user, logout }) {

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");


    const loadData = async () => {

        try {

            const jobResponse = await fetch(
                `${API}/api/jobs`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const jobData = await jobResponse.json();

            if (jobResponse.ok) {
                setJobs(jobData);
            }


            const applicationResponse = await fetch(
                `${API}/api/applications/my`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const applicationData =
                await applicationResponse.json();

            if (applicationResponse.ok) {
                setApplications(applicationData);
            }

        } catch (error) {

            setMessage(
                "Unable to connect to backend."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadData();
    }, []);


    const applyForJob = async (jobId) => {

        try {

            const response = await fetch(
                `${API}/api/applications/${jobId}`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setMessage(
                    data.message || "Application failed"
                );

                return;
            }

            setMessage(
                "Application submitted successfully!"
            );

            loadData();

        } catch (error) {

            setMessage(
                "Unable to connect to backend."
            );

        }
    };


    return (

        <div className="dashboard">

            <header className="dashboard-header">

                <div>

                    <h1>
                        Student Dashboard
                    </h1>

                    <p>
                        College Placement Management System
                    </p>

                </div>


                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>


            <main className="dashboard-content">


                <div className="welcome-card">

                    <h2>
                        Welcome, {user.name}
                    </h2>

                    <p>
                        Manage your placement applications
                        and explore eligible opportunities.
                    </p>


                    <div className="student-info">

                        <div>
                            <strong>USN</strong>
                            <span>{user.usn}</span>
                        </div>

                        <div>
                            <strong>Branch</strong>
                            <span>{user.branch}</span>
                        </div>

                        <div>
                            <strong>CGPA</strong>
                            <span>{user.cgpa}</span>
                        </div>

                        <div>
                            <strong>Email</strong>
                            <span>{user.email}</span>
                        </div>

                    </div>

                </div>


                {message && (
                    <div className="message">
                        {message}
                    </div>
                )}


                <section className="jobs-section">

                    <h2>
                        Available Placement Jobs
                    </h2>


                    {loading ? (

                        <p>
                            Loading jobs...
                        </p>

                    ) : jobs.length === 0 ? (

                        <p className="no-jobs">
                            No placement jobs available.
                        </p>

                    ) : (

                        <div className="jobs-grid">

                            {jobs.map(job => (

                                <div
                                    className="job-card"
                                    key={job._id}
                                >

                                    <h3>
                                        {job.companyName}
                                    </h3>

                                    <h4>
                                        {job.role}
                                    </h4>


                                    <p>
                                        <strong>
                                            Package:
                                        </strong>{" "}
                                        {job.packageLPA} LPA
                                    </p>


                                    <p>
                                        <strong>
                                            Minimum CGPA:
                                        </strong>{" "}
                                        {job.minimumCGPA}
                                    </p>


                                    <p>
                                        <strong>
                                            Branches:
                                        </strong>{" "}
                                        {job.branches.length
                                            ? job.branches.join(", ")
                                            : "All Branches"}
                                    </p>


                                    <p>
                                        <strong>
                                            Skills:
                                        </strong>{" "}
                                        {job.skills.length
                                            ? job.skills.join(", ")
                                            : "Not specified"}
                                    </p>


                                    <p>
                                        <strong>
                                            Deadline:
                                        </strong>{" "}
                                        {new Date(
                                            job.deadline
                                        ).toLocaleDateString()}
                                    </p>


                                    {job.eligible ? (

                                        <span className="eligible">
                                            Eligible
                                        </span>

                                    ) : (

                                        <span className="not-eligible">
                                            Not Eligible
                                        </span>

                                    )}


                                    {job.applied ? (

                                        <button
                                            className="applied-button"
                                            disabled
                                        >
                                            Applied
                                        </button>

                                    ) : job.eligible ? (

                                        <button
                                            className="apply-button"
                                            onClick={() =>
                                                applyForJob(job._id)
                                            }
                                        >
                                            Apply Now
                                        </button>

                                    ) : (

                                        <button
                                            className="disabled-button"
                                            disabled
                                        >
                                            Not Eligible
                                        </button>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                <section className="applications-section">

                    <h2>
                        My Applications
                    </h2>


                    {applications.length === 0 ? (

                        <p className="no-jobs">
                            You have not applied for any jobs yet.
                        </p>

                    ) : (

                        <div className="application-table-container">

                            <table className="application-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Company
                                        </th>

                                        <th>
                                            Role
                                        </th>

                                        <th>
                                            Package
                                        </th>

                                        <th>
                                            Applied On
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {applications.map(
                                        application => (

                                            <tr
                                                key={
                                                    application._id
                                                }
                                            >

                                                <td>
                                                    {
                                                        application.job
                                                            ?.companyName
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        application.job
                                                            ?.role
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        application.job
                                                            ?.packageLPA
                                                    } LPA
                                                </td>

                                                <td>
                                                    {new Date(
                                                        application.createdAt
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            "status-badge " +
                                                            application.status
                                                                .toLowerCase()
                                                                .replace(
                                                                    / /g,
                                                                    "-"
                                                                )
                                                        }
                                                    >
                                                        {
                                                            application.status
                                                        }
                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}



/* =========================
   ADMIN DASHBOARD
========================= */

function AdminDashboard({ user, logout }) {

    const token = localStorage.getItem("token");


    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [message, setMessage] = useState("");

    const [jobForm, setJobForm] = useState({

        companyName: "",
        role: "",
        packageLPA: "",
        minimumCGPA: "",
        branches: "",
        skills: "",
        description: "",
        deadline: ""

    });


    const loadAdminData = async () => {

        try {

            const jobsResponse = await fetch(
                `${API}/api/jobs`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const jobsData =
                await jobsResponse.json();

            if (jobsResponse.ok) {
                setJobs(jobsData);
            }


            const applicationsResponse =
                await fetch(
                    `${API}/api/applications/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


            const applicationsData =
                await applicationsResponse.json();


            if (applicationsResponse.ok) {
                setApplications(applicationsData);
            }


        } catch (error) {

            setMessage(
                "Unable to connect to backend."
            );

        }
    };


    useEffect(() => {
        loadAdminData();
    }, []);


    const handleJobChange = event => {

        setJobForm({

            ...jobForm,

            [event.target.name]:
                event.target.value

        });
    };


    const createJob = async event => {

        event.preventDefault();

        setMessage("");


        try {

            const response = await fetch(
                `${API}/api/jobs`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        companyName:
                            jobForm.companyName,

                        role:
                            jobForm.role,

                        packageLPA:
                            Number(
                                jobForm.packageLPA
                            ),

                        minimumCGPA:
                            Number(
                                jobForm.minimumCGPA
                            ),

                        branches:
                            jobForm.branches,

                        skills:
                            jobForm.skills,

                        description:
                            jobForm.description,

                        deadline:
                            jobForm.deadline

                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Unable to create job"
                );

                return;
            }


            setMessage(
                "Job created successfully!"
            );


            setJobForm({

                companyName: "",
                role: "",
                packageLPA: "",
                minimumCGPA: "",
                branches: "",
                skills: "",
                description: "",
                deadline: ""

            });


            loadAdminData();


        } catch (error) {

            setMessage(
                "Unable to connect to backend."
            );

        }
    };


    const deleteJob = async jobId => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this job?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `${API}/api/jobs/${jobId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Unable to delete job"
                );

                return;
            }


            setMessage(
                "Job deleted successfully."
            );


            loadAdminData();


        } catch (error) {

            setMessage(
                "Unable to connect to backend."
            );

        }
    };


    const updateStatus = async (
        applicationId,
        status
    ) => {

        try {

            const response = await fetch(
                `${API}/api/applications/${applicationId}/status`,
                {
                    method: "PATCH",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Unable to update status"
                );

                return;
            }


            setMessage(
                "Application status updated."
            );


            loadAdminData();


        } catch (error) {

            setMessage(
                "Unable to connect to backend."
            );

        }
    };


    return (

        <div className="dashboard">

            <header className="dashboard-header">

                <div>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Placement Administrator Portal
                    </p>

                </div>


                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>


            <main className="dashboard-content">


                <div className="welcome-card">

                    <h2>
                        Welcome, Administrator
                    </h2>

                    <p>
                        Manage placement jobs and student
                        applications from this dashboard.
                    </p>

                </div>


                {message && (
                    <div className="message">
                        {message}
                    </div>
                )}


                {/* CREATE JOB */}

                <section className="admin-form-card">

                    <h2>
                        Add New Placement Job
                    </h2>


                    <form
                        onSubmit={createJob}
                    >

                        <div className="form-grid">


                            <div>

                                <label>
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    name="companyName"
                                    value={
                                        jobForm.companyName
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    placeholder="Example: Infosys"
                                    required
                                />

                            </div>


                            <div>

                                <label>
                                    Job Role
                                </label>

                                <input
                                    type="text"
                                    name="role"
                                    value={
                                        jobForm.role
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    placeholder="Example: Software Engineer"
                                    required
                                />

                            </div>


                            <div>

                                <label>
                                    Package (LPA)
                                </label>

                                <input
                                    type="number"
                                    name="packageLPA"
                                    value={
                                        jobForm.packageLPA
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    step="0.1"
                                    min="0"
                                    required
                                />

                            </div>


                            <div>

                                <label>
                                    Minimum CGPA
                                </label>

                                <input
                                    type="number"
                                    name="minimumCGPA"
                                    value={
                                        jobForm.minimumCGPA
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    required
                                />

                            </div>


                            <div>

                                <label>
                                    Eligible Branches
                                </label>

                                <input
                                    type="text"
                                    name="branches"
                                    value={
                                        jobForm.branches
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    placeholder="CSE, ISE, ECE"
                                />

                            </div>


                            <div>

                                <label>
                                    Required Skills
                                </label>

                                <input
                                    type="text"
                                    name="skills"
                                    value={
                                        jobForm.skills
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    placeholder="Java, SQL, React"
                                />

                            </div>


                            <div>

                                <label>
                                    Application Deadline
                                </label>

                                <input
                                    type="date"
                                    name="deadline"
                                    value={
                                        jobForm.deadline
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    required
                                />

                            </div>


                            <div>

                                <label>
                                    Description
                                </label>

                                <input
                                    type="text"
                                    name="description"
                                    value={
                                        jobForm.description
                                    }
                                    onChange={
                                        handleJobChange
                                    }
                                    placeholder="Job description"
                                />

                            </div>


                        </div>


                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Add Job
                        </button>

                    </form>

                </section>


                {/* JOB LIST */}

                <section className="jobs-section">

                    <h2>
                        Placement Jobs
                    </h2>


                    <div className="jobs-grid">

                        {jobs.map(job => (

                            <div
                                className="job-card"
                                key={job._id}
                            >

                                <h3>
                                    {job.companyName}
                                </h3>

                                <h4>
                                    {job.role}
                                </h4>

                                <p>
                                    Package:{" "}
                                    {job.packageLPA} LPA
                                </p>

                                <p>
                                    Minimum CGPA:{" "}
                                    {job.minimumCGPA}
                                </p>

                                <p>
                                    Branches:{" "}
                                    {job.branches.join(", ")}
                                </p>


                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        deleteJob(
                                            job._id
                                        )
                                    }
                                >
                                    Delete Job
                                </button>

                            </div>

                        ))}

                    </div>

                </section>


                {/* APPLICATIONS */}

                <section className="applications-section">

                    <h2>
                        Student Applications
                    </h2>


                    {applications.length === 0 ? (

                        <p className="no-jobs">
                            No student applications yet.
                        </p>

                    ) : (

                        <div className="application-table-container">

                            <table className="application-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Student
                                        </th>

                                        <th>
                                            USN
                                        </th>

                                        <th>
                                            Branch
                                        </th>

                                        <th>
                                            CGPA
                                        </th>

                                        <th>
                                            Company
                                        </th>

                                        <th>
                                            Role
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {applications.map(
                                        application => (

                                            <tr
                                                key={
                                                    application._id
                                                }
                                            >

                                                <td>
                                                    {
                                                        application.student
                                                            ?.name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        application.student
                                                            ?.usn
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        application.student
                                                            ?.branch
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        application.student
                                                            ?.cgpa
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        application.job
                                                            ?.companyName
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        application.job
                                                            ?.role
                                                    }
                                                </td>

                                                <td>

                                                    <select
                                                        value={
                                                            application.status
                                                        }
                                                        onChange={event =>
                                                            updateStatus(
                                                                application._id,
                                                                event.target.value
                                                            )
                                                        }
                                                        className="status-select"
                                                    >

                                                        <option>
                                                            Applied
                                                        </option>

                                                        <option>
                                                            Under Review
                                                        </option>

                                                        <option>
                                                            Shortlisted
                                                        </option>

                                                        <option>
                                                            Interview
                                                        </option>

                                                        <option>
                                                            Selected
                                                        </option>

                                                        <option>
                                                            Rejected
                                                        </option>

                                                    </select>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


            </main>

        </div>
    );
}



/* =========================
   MAIN APP
========================= */

function App() {

    const [page, setPage] = useState("home");

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });


    useEffect(() => {

        if (user) {

            if (user.role === "admin") {
                setPage("admin-dashboard");
            } else {
                setPage("student-dashboard");
            }

        }

    }, []);


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setPage("home");
    };


    const handleLogin = loggedInUser => {

        setUser(loggedInUser);

        if (loggedInUser.role === "admin") {
            setPage("admin-dashboard");
        } else {
            setPage("student-dashboard");
        }
    };


    if (page === "student-login") {

        return (
            <StudentLogin
                onLogin={handleLogin}
            />
        );
    }


    if (page === "register") {

        return (
            <StudentRegister
                onRegister={handleLogin}
            />
        );
    }


    if (page === "admin-login") {

        return (
            <AdminLogin
                onLogin={handleLogin}
            />
        );
    }


    if (
        page === "student-dashboard" &&
        user
    ) {

        return (
            <StudentDashboard
                user={user}
                logout={logout}
            />
        );
    }


    if (
        page === "admin-dashboard" &&
        user
    ) {

        return (
            <AdminDashboard
                user={user}
                logout={logout}
            />
        );
    }


    return (
        <Home
            setPage={setPage}
        />
    );
}


export default App;
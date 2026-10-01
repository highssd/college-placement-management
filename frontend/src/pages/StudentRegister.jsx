import { useState } from "react";

function StudentRegister({ onRegister }) {
  const [formData, setFormData] = useState({
    name: "",
    usn: "",
    email: "",
    password: "",
    branch: "",
    cgpa: "",
    skills: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            usn: formData.usn,
            email: formData.email,
            password: formData.password,
            branch: formData.branch,
            cgpa: Number(formData.cgpa),
            skills: formData.skills
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Registration successful!");

      if (onRegister) {
        onRegister(data.user);
      }

    } catch (error) {
      setMessage(
        "Cannot connect to server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h2>Student Registration</h2>

        <p className="login-subtitle">
          Create your placement portal account
        </p>

        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>USN</label>

          <input
            type="text"
            name="usn"
            placeholder="Enter your USN"
            value={formData.usn}
            onChange={handleChange}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Branch</label>

          <input
            type="text"
            name="branch"
            placeholder="Example: CSE"
            value={formData.branch}
            onChange={handleChange}
            required
          />

          <label>CGPA</label>

          <input
            type="number"
            name="cgpa"
            placeholder="Example: 8.5"
            min="0"
            max="10"
            step="0.01"
            value={formData.cgpa}
            onChange={handleChange}
            required
          />

          <label>Skills</label>

          <input
            type="text"
            name="skills"
            placeholder="Example: Python, JavaScript, SQL"
            value={formData.skills}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default StudentRegister;
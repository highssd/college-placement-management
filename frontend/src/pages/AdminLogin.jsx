import { useState } from "react";

function AdminLogin({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (event) => {

    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        setMessage(
          data.message || "Login failed"
        );

        return;
      }


      if (data.user.role !== "admin") {

        setMessage(
          "This account is not an administrator account."
        );

        return;
      }


      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      setMessage(
        "Admin login successful!"
      );


      if (onLogin) {
        onLogin(data.user);
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


        <h2>
          Admin Login
        </h2>


        <p className="login-subtitle">
          Placement Administrator Portal
        </p>


        <form onSubmit={handleLogin}>


          <label>
            Email
          </label>


          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />


          <label>
            Password
          </label>


          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />


          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Admin Login"}

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


export default AdminLogin;
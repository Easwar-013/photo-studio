import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("staff");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous login session
    localStorage.clear();

    try {
      // OWNER LOGIN
      if (
        role === "staff" &&
        username === "MSMAA01" &&
        password === "7639670007"
      ) {
        localStorage.setItem("role", "owner");

        toast.success("Owner Login Successful");

        navigate("/owner");
        return;
      }

      // STAFF LOGIN
      if (role === "staff") {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/staff/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            staffId: username.trim(),
            password,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          toast.error(data.message);
          return;
        }

        // Clear old values
        localStorage.removeItem("staffId");
        localStorage.removeItem("staffName");

        // Save logged-in staff details
        localStorage.setItem("staffId", data.staff.staffId);

        localStorage.setItem("staffName", data.staff.name);

        localStorage.setItem("role", "staff");

        console.log("Saved Staff ID:", data.staff.staffId);

        toast.success("Login Successful");

        navigate("/staff");
        return;
      }
      // CUSTOMER & B2B LOGIN
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      if (data.role === "customer") {
        localStorage.setItem("customerEmail", data.user.email);
        localStorage.setItem("role", "customer");

        toast.success("Login Successful");

        navigate("/customer");
      }

      if (data.role === "b2b") {
        localStorage.setItem("b2bEmail", data.user.email);
        localStorage.setItem("role", "b2b");

        toast.success("Login Successful");

        navigate("/b2b");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    }
  };;

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const registerRole = role === "staff" ? "customer" : role;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registerName,
            email: registerEmail,
            password: registerPassword,
            role: registerRole,
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Registration Successful");

      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");

      setMode("login");
    } catch (error) {
      console.log(error);
      toast.error("Registration Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <h1>Muhurtham Studios</h1>
          <p>MANAGEMENT PORTAL · LOGIN</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            LOGIN
          </button>

          {role !== "staff" && (
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              REGISTER
            </button>
          )}
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>LOGIN TYPE</label>

              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);

                  // Staff can only log in
                  if (e.target.value === "staff") {
                    setMode("login");
                  }
                }}
              >
                <option value="staff">Staff</option>
                <option value="customer">Direct Customer</option>
                <option value="b2b">B2B Client</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                {role === "staff" ? "STAFF ID / USERNAME" : "EMAIL ADDRESS"}
              </label>

              <input
                type="text"
                placeholder={
                  role === "staff" ? "e.g. MS001" : "Enter Email Address"
                }
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>PASSWORD</label>

              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-btn">LOGIN →</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>{role === "b2b" ? "COMPANY NAME" : "FULL NAME"}</label>

              <input
                type="text"
                placeholder="Enter Name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>EMAIL</label>

              <input
                type="email"
                placeholder="Enter Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>PASSWORD</label>

              <input
                type="password"
                placeholder="Create Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-btn">REGISTER →</button>
          </form>
        )}
      </div>
      
    </div>
  );
};

export default Login;

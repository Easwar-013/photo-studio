import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "#134e4a",
        color: "white",
        padding: "20px",
      }}
    >
      <h3>Menu</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Link to="/" style={{ color: "white" }}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/staff" style={{ color: "white" }}>
            Staff
          </Link>
        </li>
        <li>
          <Link to="/jobs" style={{ color: "white" }}>
            Jobs
          </Link>
        </li>
        <li>
          <Link to="/attendance" style={{ color: "white" }}>
            Attendance
          </Link>
        </li>
        <li>
          <Link to="/payroll" style={{ color: "white" }}>
            Payroll
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

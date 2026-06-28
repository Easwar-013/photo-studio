import React from "react";
import "./OwnerDashboard.css";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const cards = [
    {
      icon: "👥",
      title: "Staff Management",
      desc: "Create, Edit and Remove Staff IDs",
      button: "Manage Staff",
      path: "/owner/staff",
    },
    {
      icon: "📋",
      title: "Job Card Management",
      desc: "Manage Customer Projects",
      button: "Manage Jobs",
      path: "/jobcards",
    },
    {
      icon: "📍",
      title: "Attendance",
      desc: "View Staff Attendance",
      button: "Attendance Report",
      path: "/attendance",
    },
    {
      icon: "💰",
      title: "Salary Payroll",
      desc: "Generate Monthly Payroll",
      button: "Generate Payroll",
      path: "/payroll",
    },
    {
      icon: "👤",
      title: "Customers",
      desc: "Manage Direct Customers",
      button: "View Customers",
      path: "/owner/customers",
    },
    {
      icon: "🏢",
      title: "B2B Clients",
      desc: "Manage Business Clients",
      button: "View Clients",
      path: "/owner/b2b",
    },
    {
      icon: "💳",
      title: "Payments",
      desc: "Track Customer Payments",
      button: "View Payments",
      path: "/payments",
    },
  ];

  return (
    <div className="owner-dashboard">
      <div className="owner-header">
        <div>
          <h1>Welcome Back, Owner 👋</h1>
          <p>
            Manage your studio, staff, customers and projects from one place.
          </p>
        </div>

        <div className="header-right">
          <div className="date-box">{new Date().toLocaleDateString()}</div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div className="dashboard-card" key={card.title}>
            <div className="card-icon">{card.icon}</div>

            <h2>{card.title}</h2>

            <p>{card.desc}</p>

            <button onClick={() => navigate(card.path)}>{card.button} →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;

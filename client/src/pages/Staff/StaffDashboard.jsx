import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Owner/OwnerDashboard.css";

const StaffDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [myJobs, setMyJobs] = useState([]);

  const navigate = useNavigate();

  const staffName = localStorage.getItem("staffName");

  useEffect(() => {
    fetchAttendance();
    fetchPayroll();
    fetchMyJobs();
  }, []);

  const fetchAttendance = async () => {
    try {
      const staffId = localStorage.getItem("staffId");

      console.log("Logged Staff ID:", staffId);

      if (!staffId) {
        setAttendance([]);
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/attendance/staff/${encodeURIComponent(staffId)}`,
      );

      const data = await res.json();

      console.log("Attendance Data:", data);

      const sortedAttendance = Array.isArray(data)
        ? [...data].sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
        : [];

      setAttendance(sortedAttendance);
    } catch (error) {
      console.log(error);
      setAttendance([]);
    }
  };

  const fetchPayroll = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/payroll");
      const data = await res.json();

      setPayroll(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const staffId = localStorage.getItem("staffId");

      const res = await fetch(
        `http://localhost:5000/api/jobcards/staff/${encodeURIComponent(staffId)}`,
      );

      const data = await res.json();

      setMyJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  

  const handleCheckIn = async () => {
    const staffId = localStorage.getItem("staffId");

    if (!staffId) {
      toast.error("Staff not logged in");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/attendance/checkin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            staffId,
            location: "Studio",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      fetchAttendance();
    } catch (error) {
      console.log(error);
      toast.error("Check In Failed");
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/attendance/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      fetchAttendance();
    } catch (error) {
      console.log(error);
      toast.error("Check Out Failed");
    }
  };

  const groupedAttendance = attendance.reduce((acc, item) => {
    const date = new Date(item.checkIn).toLocaleDateString();

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(item);

    return acc;
  }, {});

  

  return (
    <div className="owner-page">
      <div className="staff-header">
        <div>
          <h1>Welcome Back, {staffName} 👋</h1>

          <p>Manage your daily work, attendance and assigned projects.</p>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("staffId");
            localStorage.removeItem("staffName");
            localStorage.removeItem("role"); // Add this line

            toast.success("Logged Out Successfully");

            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      <div className="staff-summary">
        <div className="summary-card">
          <span>👤</span>

          <h3>Staff ID</h3>

          <h2>{localStorage.getItem("staffId")}</h2>
        </div>

        <div className="summary-card">
          <span>📍</span>

          <h3>Attendance</h3>

          <h2>
            {attendance.some((a) => !a.checkOut)
              ? "Checked In"
              : "Not Checked In"}
          </h2>
        </div>

        <div className="summary-card">
          <span>🛠</span>

          <h3>My Jobs</h3>

          <h2>{myJobs.length}</h2>
        </div>

        <div className="summary-card">
          <span>💰</span>

          <h3>Payroll</h3>

          <h2>{payroll.length}</h2>
        </div>
      </div>

      <div className="owner-card">
        <h2>Quick Actions</h2>

        <div className="quick-actions">
          <button onClick={handleCheckIn}>📍 Check In</button>

          <button onClick={() => navigate("/staff/available-jobs")}>
            📋 Available Jobs
          </button>

          <button onClick={() => navigate("/staff/my-jobs")}>🛠 My Jobs</button>
        </div>
      </div>

      <div className="dashboard-card">
        <h2>📅 Attendance History</h2>

        <p>
          View your complete attendance records, check-in/out timings and worked
          hours.
        </p>

        <button onClick={() => navigate("/staff/attendance")}>
          View Attendance
        </button>
      </div>

      <div className="owner-card">
        <h2>Salary Records</h2>

        {payroll.length > 0 ? (
          <div className="salary-grid">
            {payroll.map((salary) => (
              <div className="salary-card" key={salary._id}>
                <h3>{salary.month}</h3>

                <div className="salary-row">
                  <span>Salary</span>

                  <strong>₹{salary.salary}</strong>
                </div>

                <div className="salary-row">
                  <span>Bonus</span>

                  <strong style={{ color: "#4ade80" }}>₹{salary.bonus}</strong>
                </div>

                <div className="salary-row">
                  <span>Deduction</span>

                  <strong style={{ color: "#ef4444" }}>
                    ₹{salary.deduction}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No Payroll Records</p>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;

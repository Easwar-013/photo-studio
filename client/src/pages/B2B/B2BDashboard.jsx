import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Customer/CustomerDashboard.css";
import { toast } from "react-toastify";

const B2BDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchB2BJobs();
  }, []);

  const fetchB2BJobs = async () => {
    try {
      const b2bEmail = localStorage.getItem("b2bEmail");

      if (!b2bEmail) {
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobcards/customer/${b2bEmail}`,
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setJobs(data);

        if (data.length > 0) {
          setSelectedJob(data[0]);
        }
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-dashboard">
        <div className="loading-card">
          <h2>Loading Projects...</h2>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="customer-dashboard">
        <div className="loading-card">
          <h2>No Projects Found</h2>
          <p>No projects are assigned to this B2B account.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="customer-dashboard">
      <div className="customer-header">
        <div>
          <h1>B2B Projects</h1>
          <p>Manage your business projects and payments</p>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("b2bEmail");

            toast.success("Logged Out Successfully");

            setTimeout(() => {
              navigate("/login");
            }, 1000);
          }}
        >
          Logout
        </button>
      </div>

      <div className="customer-layout">
        {/* LEFT SIDE */}

        <div className="project-sidebar">
          <h2>Projects</h2>

          {jobs.map((job) => (
            <div
              key={job._id}
              className={`project-item ${
                selectedJob?._id === job._id ? "active-project" : ""
              }`}
              onClick={() => setSelectedJob(job)}
            >
              <h3>{job.workType}</h3>

              <p>Job #{job.jobId}</p>

              <span>{job.status}</span>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}

        <div className="project-details">
          {selectedJob && (
            <>
              <div className="project-title">
                <h2>{selectedJob.workType}</h2>

                <span
                  className={`status-badge ${
                    selectedJob.status === "Completed"
                      ? "completed"
                      : selectedJob.status === "In Progress"
                        ? "progress"
                        : selectedJob.status === "Accepted"
                          ? "accepted"
                          : "available"
                  }`}
                >
                  {selectedJob.status}
                </span>
              </div>

              <div className="info-grid">
                <div className="info-box">
                  <h4>Company</h4>
                  <p>{selectedJob.customerName}</p>
                </div>

                <div className="info-box">
                  <h4>Job ID</h4>
                  <p>{selectedJob.jobId}</p>
                </div>

                <div className="info-box">
                  <h4>Assigned Editor</h4>
                  <p>{selectedJob.assignedEditor || "-"}</p>
                </div>

                <div className="info-box">
                  <h4>Delivery Date</h4>
                  <p>
                    {selectedJob.deliveryDate
                      ? new Date(selectedJob.deliveryDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="section">
                <h3>Work Progress</h3>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${selectedJob.progress || 0}%`,
                    }}
                  >
                    {selectedJob.progress || 0}%
                  </div>
                </div>
              </div>
              <div className="section">
                <h3>Payment Summary</h3>

                <div className="payment-grid">
                  <div className="payment-card">
                    <h4>Total Amount</h4>
                    <p>₹{selectedJob.totalAmount || 0}</p>
                  </div>

                  <div className="payment-card">
                    <h4>Paid Amount</h4>
                    <p>₹{selectedJob.paidAmount || 0}</p>
                  </div>

                  <div className="payment-card pending-card">
                    <h4>Pending Amount</h4>
                    <p>₹{selectedJob.pendingAmount || 0}</p>
                  </div>
                </div>

                {selectedJob.pendingAmount > 0 && (
                  <button
                    className="pay-btn"
                    onClick={() =>
                      navigate("/payment", {
                        state: {
                          amount: selectedJob.pendingAmount,
                          jobId: selectedJob._id,
                        },
                      })
                    }
                  >
                    💳 Pay Pending Amount
                  </button>
                )}
              </div>

              <div className="section">
                <h3>Project Notes</h3>

                <div className="notes-box">
                  {selectedJob.notes ? (
                    <p>{selectedJob.notes}</p>
                  ) : (
                    <p>No project notes available.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default B2BDashboard;
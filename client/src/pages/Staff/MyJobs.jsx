import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../Owner/OwnerDashboard.css";
import socket from "../../socket";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);

  const staffId = localStorage.getItem("staffId");

  useEffect(() => {
    fetchMyJobs();

    socket.on("jobAccepted", () => {
      fetchMyJobs();
    });

    socket.on("jobUpdated", () => {
      fetchMyJobs();
    });

    socket.on("jobCompleted", () => {
      fetchMyJobs();
    });

    return () => {
      socket.off("jobAccepted");
      socket.off("jobUpdated");
      socket.off("jobCompleted");
    };
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobcards/staff/${encodeURIComponent(
          staffId,
        )}`,
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.log(error);
      setJobs([]);
      toast.error("Unable to load your jobs");
    }
  };

  const updateProgress = async (id, progress, notes) => {
    let status = "Accepted";

    if (progress > 0 && progress < 100) {
      status = "In Progress";
    }

    if (progress === 100) {
      status = "Completed";
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobcards/progress/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            progress,
            notes,
            status,
          }),
        },
      );

      if (!res.ok) {
        toast.error("Failed to update progress");
        return;
      }

      toast.success("Progress Updated Successfully");

      fetchMyJobs();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const completeJob = async (id) => {
    const confirmComplete = window.confirm(
      "Are you sure you want to complete this job?",
    );

    if (!confirmComplete) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobcards/complete/${id}`,
        {
          method: "PUT",
        },
      );

      if (!res.ok) {
        toast.error("Unable to complete job");
        return;
      }

      toast.success("🎉 Job Completed Successfully");

      fetchMyJobs();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="owner-page">
      <h1>My Jobs</h1>

      <div className="owner-card">
        <table>
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Customer</th>
              <th>Work Type</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.jobId}</td>

                  <td>{job.customerName}</td>

                  <td>{job.workType}</td>

                  <td
                    style={{
                      color:
                        job.status === "Completed"
                          ? "limegreen"
                          : job.status === "In Progress"
                            ? "orange"
                            : "#2196f3",
                      fontWeight: "bold",
                    }}
                  >
                    {job.status}
                  </td>

                  <td style={{ width: "180px" }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={job.progress}
                      disabled={job.status === "Completed"}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        setJobs(
                          jobs.map((j) =>
                            j._id === job._id ? { ...j, progress: value } : j,
                          ),
                        );
                      }}
                    />

                    <div>{job.progress}%</div>
                  </td>

                  <td>
                    <textarea
                      rows="2"
                      disabled={job.status === "Completed"}
                      value={job.notes || ""}
                      onChange={(e) => {
                        setJobs(
                          jobs.map((j) =>
                            j._id === job._id
                              ? { ...j, notes: e.target.value }
                              : j,
                          ),
                        );
                      }}
                    />
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {job.status !== "Completed" && (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() =>
                              updateProgress(job._id, job.progress, job.notes)
                            }
                          >
                            Save Progress
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => completeJob(job._id)}
                          >
                            Complete Job
                          </button>
                        </>
                      )}

                      {job.status === "Completed" && (
                        <span
                          style={{
                            color: "limegreen",
                            fontWeight: "bold",
                          }}
                        >
                          ✔ Completed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  No Accepted Jobs
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyJobs;

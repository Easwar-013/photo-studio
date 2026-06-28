import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../Owner/OwnerDashboard.css";
import socket from "../../socket";

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);

  const staffId = localStorage.getItem("staffId");
  const staffName = localStorage.getItem("staffName");

  useEffect(() => {
    fetchAvailableJobs();

    socket.on("newJob", () => {
      fetchAvailableJobs();
      toast.info("📸 New Job Available");
    });

    socket.on("jobAccepted", () => {
      fetchAvailableJobs();
    });

    socket.on("jobCompleted", () => {
      fetchAvailableJobs();
    });

    return () => {
      socket.off("newJob");
      socket.off("jobAccepted");
      socket.off("jobCompleted");
    };
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/jobcards/available");

      const data = await res.json();

      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to load available jobs");
    }
  };

  const acceptJob = async (jobId) => {
    const confirmAccept = window.confirm("Do you want to accept this job?");

    if (!confirmAccept) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/jobcards/accept/${jobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            staffId,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Unable to accept job");
        return;
      }

      toast.success("🎉 Job Accepted Successfully");

      fetchAvailableJobs();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="owner-page">
      <h1>Available Jobs</h1>

      <div className="owner-card">
        <h3>
          Welcome, {staffName} ({staffId})
        </h3>

        <table>
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Customer</th>
              <th>Work Type</th>
              <th>Delivery Date</th>
              <th>Amount</th>
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

                  <td>
                    {job.deliveryDate
                      ? new Date(job.deliveryDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>₹{job.totalAmount}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => acceptJob(job._id)}
                    >
                      Accept Job
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  No Available Jobs
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableJobs;

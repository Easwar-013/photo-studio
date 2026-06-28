import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./OwnerDashboard.css";
import socket from "../../socket";

const JobCardManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    jobId: "",
    customerName: "",
    customerEmail: "",
    workType: "",
    progress: "",
    totalAmount: "",
    paidAmount: "",
    pendingAmount: "",
    notes: "",
    deliveryDate: "",
  });

  useEffect(() => {
    fetchJobs();
    fetchUsers();

    socket.on("newJob", () => {
      fetchJobs();
      toast.info("📸 New Job Created");
    });

    socket.on("jobAccepted", () => {
      fetchJobs();
    });

    socket.on("jobUpdated", () => {
      fetchJobs();
    });

    socket.on("jobCompleted", () => {
      fetchJobs();
    });

    return () => {
      socket.off("newJob");
      socket.off("jobAccepted");
      socket.off("jobUpdated");
      socket.off("jobCompleted");
    };
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobcards`);

      const data = await res.json();

      const sortedJobs = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      setJobs(sortedJobs);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load job cards");
    }
  };

  const fetchUsers = async () => {
    try {
      const [customerRes, b2bRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/customers`),
        fetch(`${import.meta.env.VITE_API_URL}/api/b2b`),
      ]);

      const customers = await customerRes.json();
      const b2bClients = await b2bRes.json();

      setUsers([
        ...(Array.isArray(customers) ? customers : []),
        ...(Array.isArray(b2bClients) ? b2bClients : []),
      ]);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load customers");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingId) {
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobcards/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              assignedEditor: "",
              status: "Available",
              progress: 0,
            }),
          },
        );
      } else {
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobcards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            assignedEditor: "",
            status: "Available",
            progress: 0,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Operation Failed");
        return;
      }

      if (editingId) {
        toast.success("Job Card Updated Successfully");
      } else {
        toast.success("Job Card Created Successfully");
      }

      setEditingId(null);
      setShowForm(false);

      setFormData({
        jobId: "",
        customerName: "",
        customerEmail: "",
        workType: "",
        progress: 0,
        totalAmount: "",
        paidAmount: "",
        pendingAmount: "",
        notes: "",
        deliveryDate: "",
      });

      fetchJobs();
      setShowForm(false);
    } catch (error) {
      console.log(error);
      toast.error("Operation Failed");
    }
  };

  const handleEdit = (job) => {
    setShowForm(true);
    setEditingId(job._id);

    setFormData({
      jobId: job.jobId || "",
      customerName: job.customerName || "",
      customerEmail: job.customerEmail || "",
      workType: job.workType || "",
      progress: job.progress || "",
      totalAmount: job.totalAmount || "",
      paidAmount: job.paidAmount || "",
      pendingAmount: job.pendingAmount || "",
      notes: job.notes || "",
      deliveryDate: job.deliveryDate
        ? new Date(job.deliveryDate).toISOString().split("T")[0]
        : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this Job Card?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobcards/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Delete Failed");
        return;
      }

      toast.success("Job Deleted Successfully");

      fetchJobs();
    } catch (error) {
      console.log(error);
      toast.error("Delete Failed");
    }
  };
  return (
    <div className="owner-page">
      <h1>Job Card Management</h1>

      {/* ================= CREATE / EDIT FORM ================= */}

      {showForm ? (
        <div className="owner-card">
          <h2>{editingId ? "Edit Job Card" : "Create Job Card"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="jobId"
              placeholder="Job ID"
              value={formData.jobId}
              onChange={handleChange}
              required
            />

            <select
              required
              value={formData.customerEmail}
              onChange={(e) => {
                const selectedUser = users.find(
                  (u) => u.email === e.target.value,
                );

                setFormData({
                  ...formData,
                  customerName: selectedUser?.name || "",
                  customerEmail: selectedUser?.email || "",
                });
              }}
            >
              <option value="">Select Customer / B2B Client</option>

              {users.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>

            <input
              name="workType"
              placeholder="Work Type"
              value={formData.workType}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="totalAmount"
              placeholder="Total Amount"
              value={formData.totalAmount}
              onChange={handleChange}
            />

            <input
              type="number"
              name="paidAmount"
              placeholder="Paid Amount"
              value={formData.paidAmount}
              onChange={handleChange}
            />

            <input
              type="number"
              name="pendingAmount"
              placeholder="Pending Amount"
              value={formData.pendingAmount}
              onChange={handleChange}
            />

            <textarea
              name="notes"
              placeholder="Project Notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            />

            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
            />

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "20px",
              }}
            >
              <button type="submit">
                {editingId ? "Update Job Card" : "Create Job Card"}
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);

                  setFormData({
                    jobId: "",
                    customerName: "",
                    customerEmail: "",
                    workType: "",
                    progress: 0,
                    totalAmount: "",
                    paidAmount: "",
                    pendingAmount: "",
                    notes: "",
                    deliveryDate: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="owner-card">
          <div className="card-header">
            <h2>All Job Cards</h2>

            <button
              className="add-btn"
              onClick={() => {
                setEditingId(null);

                setFormData({
                  jobId: "",
                  customerName: "",
                  customerEmail: "",
                  workType: "",
                  progress: 0,
                  totalAmount: "",
                  paidAmount: "",
                  pendingAmount: "",
                  notes: "",
                  deliveryDate: "",
                });

                setShowForm(true);
              }}
            >
              + Create Job Card
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Accepted By</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Total</th>
                <th>Pending</th>
                <th>Delivery</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job._id}>
                    <td>{job.jobId}</td>

                    <td>{job.customerName}</td>

                    <td>{job.workType}</td>

                    <td>{job.assignedEditor || "Not Accepted"}</td>

                    <td
                      style={{
                        color:
                          job.status === "Available"
                            ? "#2196f3"
                            : job.status === "Accepted"
                              ? "#ff9800"
                              : job.status === "In Progress"
                                ? "#ff5722"
                                : "#4caf50",
                        fontWeight: "bold",
                      }}
                    >
                      {job.status}
                    </td>

                    <td>{job.progress}%</td>

                    <td>₹{job.totalAmount}</td>

                    <td>₹{job.pendingAmount}</td>

                    <td>
                      {job.deliveryDate
                        ? new Date(job.deliveryDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => {
                            handleEdit(job);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(job._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    No Job Cards Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobCardManagement;
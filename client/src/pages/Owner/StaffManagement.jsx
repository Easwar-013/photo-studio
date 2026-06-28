import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./OwnerDashboard.css";

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/staff`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setStaffs(data);
      } else {
        setStaffs([]);
      }
    } catch (error) {
      console.error(error);
      setStaffs([]);
      toast.error("Failed to load staff records");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/staff/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to delete staff");
        return;
      }

      toast.success("Staff Deleted Successfully");

      fetchStaffs();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete staff");
    }
  };

  const handleEdit = (staff) => {
    navigate("/owner/create-staff", {
      state: {
        staff,
      },
    });
  };

  return (
    <div className="owner-page">
      <h1>Staff Management</h1>

      <div className="owner-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>All Staffs</h2>

          <button
            className="create-btn"
            onClick={() => navigate("/owner/create-staff")}
          >
            + Create Staff
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Password</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {staffs.length > 0 ? (
              staffs.map((staff) => (
                <tr key={staff._id}>
                  <td>{staff.staffId}</td>
                  <td>{staff.name}</td>
                  <td>{staff.phone}</td>
                  <td>{staff.department}</td>
                  <td>{staff.password}</td>
                  <td>₹{staff.salary}</td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(staff)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(staff._id)}
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
                  colSpan="7"
                  style={{
                    textAlign: "center",
                  }}
                >
                  No Staff Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffManagement;

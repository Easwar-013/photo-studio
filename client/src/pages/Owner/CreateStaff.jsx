import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./OwnerDashboard.css";

const CreateStaff = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editingStaff = location.state?.staff;

  const [formData, setFormData] = useState({
    staffId: "",
    name: "",
    phone: "",
    department: "",
    salary: "",
    password: "",
  });

  useEffect(() => {
    if (editingStaff) {
      setFormData({
        staffId: editingStaff.staffId,
        name: editingStaff.name,
        phone: editingStaff.phone,
        department: editingStaff.department,
        salary: editingStaff.salary,
        password: editingStaff.password,
      });
    }
  }, [editingStaff]);

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

      if (editingStaff) {
        response = await fetch(
          `http://localhost:5000/api/staff/${editingStaff._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          },
        );
      } else {
        response = await fetch("http://localhost:5000/api/staff", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Operation Failed");
        return;
      }

      if (editingStaff) {
        toast.success("Staff Updated Successfully");
      } else {
        toast.success("Staff Created Successfully");
      }

      setTimeout(() => {
        navigate("/owner/staff");
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error("Operation Failed");
    }
  };

  return (
    <div className="owner-page">
      <h1>{editingStaff ? "Edit Staff" : "Create Staff"}</h1>

      <div className="owner-card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="staffId"
            placeholder="Staff ID"
            value={formData.staffId}
            onChange={handleChange}
            required
            disabled={editingStaff}
          />

          <input
            type="text"
            name="name"
            placeholder="Staff Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <button type="submit">
              {editingStaff ? "Update Staff" : "Create Staff"}
            </button>

            <button
              type="button"
              className="delete-btn"
              onClick={() => navigate("/owner/staff")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStaff;

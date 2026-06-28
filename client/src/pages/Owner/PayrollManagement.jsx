import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OwnerDashboard.css";

const PayrollManagement = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payroll`);
      const data = await res.json();

      setPayrolls(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const generatePayroll = async () => {
    if (!staffId || !month) {
      toast.warning("Enter Staff ID and Month");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payroll/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            staffId,
            month,
          }),
        },
      );

      const data = await res.json();

      toast.success(data.message || "Payroll Generated");

      fetchPayrolls();

      setStaffId("");
      setMonth("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Generate Payroll");
    }
  };

  const deletePayroll = async (id) => {
    if (!window.confirm("Delete this payroll record?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payroll/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      toast.success(data.message || "Payroll Deleted");

      fetchPayrolls();
    } catch (error) {
      console.log(error);
      toast.error("Failed to Delete Payroll");
    }
  };

  return (
    <div className="owner-page">
      <h1>Payroll Management</h1>

      <div className="owner-card">
        <h2>Generate Payroll</h2>

        <div className="payroll-form">
          <input
            type="text"
            placeholder="Staff ID (#004)"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Month (June 2026)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />

          <button className="generate-btn" onClick={generatePayroll}>
            Generate Payroll
          </button>
        </div>
      </div>

      <div className="owner-card">
        <h2>Payroll Records</h2>

        <table>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Month</th>
              <th>Base Salary</th>
              <th>Attended Days</th>
              <th>Leaves</th>
              <th>Deduction</th>
              <th>Final Salary</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {payrolls.length > 0 ? (
              payrolls.map((payroll) => (
                <tr key={payroll._id}>
                  <td>{payroll.staffId}</td>
                  <td>{payroll.month}</td>
                  <td>₹{payroll.baseSalary}</td>
                  <td>{payroll.attendedDays}</td>
                  <td>{payroll.leaveDays}</td>
                  <td>₹{payroll.deduction}</td>
                  <td>₹{payroll.salary}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deletePayroll(payroll._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No Payroll Records Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default PayrollManagement;

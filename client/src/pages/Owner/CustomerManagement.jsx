import { useEffect, useState } from "react";
import "./OwnerDashboard.css";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchCustomers();
    fetchJobs();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/customers");

      const data = await res.json();

      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/jobcards");

      const data = await res.json();

      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const closeCustomer = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/customers/close/${id}`, {
        method: "PUT",
      });

      fetchCustomers();
    } catch (error) {
      console.log(error);
    }
  };

  const activateCustomer = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/customers/activate/${id}`, {
        method: "PUT",
      });

      fetchCustomers();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete Customer Permanently?")) return;

    try {
      await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: "DELETE",
      });

      fetchCustomers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="owner-page">
      <h1>Customer Management</h1>

      <div className="owner-card">
        <h2>Customers & Projects</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Project</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Pending</th>
              <th>Account</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => {
                const job = jobs.find(
                  (j) => j.customerEmail === customer.email,
                );

                return (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>

                    <td>{customer.email}</td>

                    <td>{job ? job.workType : "No Project"}</td>

                    <td>{job ? job.status : "-"}</td>

                    <td>{job ? `${job.progress}%` : "-"}</td>

                    <td>{job ? `₹${job.pendingAmount}` : "-"}</td>

                    <td>{customer.isActive ? "🟢 Active" : "🔴 Closed"}</td>

                    <td>
                      <div className="action-buttons">
                        {customer.isActive ? (
                          <button
                            className="edit-btn"
                            onClick={() => closeCustomer(customer._id)}
                          >
                            Close
                          </button>
                        ) : (
                          <button
                            className="edit-btn"
                            onClick={() => activateCustomer(customer._id)}
                          >
                            Activate
                          </button>
                        )}

                        <button
                          className="delete-btn"
                          onClick={() => deleteCustomer(customer._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8">No Customers Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerManagement;

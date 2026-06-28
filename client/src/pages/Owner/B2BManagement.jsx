import { useEffect, useState } from "react";
import "./OwnerDashboard.css";

const B2BManagement = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/b2b`);

      const data = await res.json();

      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="owner-page">
      <h1>B2B Client Management</h1>

      <div className="owner-card">
        <h2>Permanent Business Clients</h2>

        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>Permanent Account</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No B2B Clients Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default B2BManagement;

import React from "react";
import "./OwnerDashboard.css";

const Payments = () => {
  return (
    <div className="owner-page">
      <h1>Payment Management</h1>

      <div className="owner-card">
        <h2>Customer Payments</h2>

        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>No Data</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;

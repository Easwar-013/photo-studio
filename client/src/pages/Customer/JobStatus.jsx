import React from "react";

const JobStatus = () => {
  return (
    <div>
      <h2>Job Status</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Work Type</th>
            <th>Status</th>
            <th>Delivery Date</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>JOB001</td>
            <td>Wedding Album</td>
            <td>Editing</td>
            <td>10-07-2026</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default JobStatus;

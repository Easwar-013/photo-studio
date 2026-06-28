import React from "react";

const Projects = () => {
  return (
    <div>
      <h2>B2B Projects</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Client</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>PRO001</td>
            <td>ABC Events</td>
            <td>In Progress</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Projects;

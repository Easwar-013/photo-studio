import { useEffect, useState } from "react";
import "./OwnerDashboard.css";

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance");
      const data = await res.json();

      setAttendance(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="owner-page">
      <h1>Attendance Management</h1>

      <div className="owner-card">
        <h2>Staff Attendance Records</h2>

        <table>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Location</th>
            </tr>
          </thead>

          <tbody>
            {attendance.length > 0 ? (
              attendance.map((item) => (
                <tr key={item._id}>
                  <td>{item.staffId}</td>

                  <td>
                    {item.checkIn
                      ? new Date(item.checkIn).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    {item.checkOut
                      ? new Date(item.checkOut).toLocaleString()
                      : "Not Checked Out"}
                  </td>

                  <td>{item.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No Attendance Records Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceManagement;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx-js-style";
import "../Owner/OwnerDashboard.css";

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const staffId = localStorage.getItem("staffId");

      if (!staffId) {
        toast.error("Staff not logged in");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/attendance/staff/${encodeURIComponent(
          staffId
        )}`
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        const sorted = [...data].sort(
          (a, b) => new Date(b.checkIn) - new Date(a.checkIn)
        );

        setAttendance(sorted);
      } else {
        setAttendance([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load attendance");
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/attendance/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      fetchAttendance(); // Refresh attendance history
    } catch (error) {
      console.log(error);
      toast.error("Check Out Failed");
    }
  };

  const groupedAttendance = useMemo(() => {
    const groups = {};

    attendance.forEach((record) => {
      const date = new Date(record.checkIn).toLocaleDateString();

      if (!groups[date]) groups[date] = [];

      groups[date].push(record);
    });

    return Object.entries(groups);
  }, [attendance]);

  const calculateWorkedHours = (records) => {
    let total = 0;

    records.forEach((record) => {
      if (record.checkOut) {
        total +=
          new Date(record.checkOut).getTime() -
          new Date(record.checkIn).getTime();
      }
    });

    const hrs = Math.floor(total / (1000 * 60 * 60));

    const mins = Math.floor(
      (total % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${hrs}h ${mins}m`;
  };
  const downloadAttendanceExcel = () => {
    const staffId = localStorage.getItem("staffId") || "Unknown";
    const staffName = localStorage.getItem("staffName") || "Unknown";

    let totalMinutes = 0;
    const uniqueDates = new Set();

    const report = [];

    // ===============================
    // COMPANY HEADER
    // ===============================

    report.push(["MUHURTHAM STUDIO MANAGEMENT SYSTEM"]);

    report.push([]);

    report.push(["Attendance Report"]);

    report.push([]);

    report.push(["Staff Name", staffName]);

    report.push(["Staff ID", staffId]);

    report.push(["Generated On", new Date().toLocaleString()]);

    report.push([]);

    // ===============================
    // TABLE HEADER
    // ===============================

    report.push([
      "S.No",
      "Date",
      "Check In",
      "Check Out",
      "Worked Hours",
      "Status",
      "Location",
    ]);

    // ===============================
    // TABLE DATA
    // ===============================

    attendance.forEach((record, index) => {
      uniqueDates.add(new Date(record.checkIn).toLocaleDateString());

      let worked = "--";

      if (record.checkOut) {
        const diff = new Date(record.checkOut) - new Date(record.checkIn);

        totalMinutes += Math.floor(diff / (1000 * 60));

        const hrs = Math.floor(diff / (1000 * 60 * 60));

        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        worked = `${hrs}h ${mins}m`;
      }

      report.push([
        index + 1,

        new Date(record.checkIn).toLocaleDateString(),

        new Date(record.checkIn).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),

        record.checkOut
          ? new Date(record.checkOut).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--",

        worked,

        record.checkOut ? "Completed" : "Working",

        record.location || "Studio",
      ]);
    });

    // ===============================
    // SUMMARY
    // ===============================

    report.push([]);

    report.push(["SUMMARY"]);

    report.push(["Total Attendance Days", uniqueDates.size]);

    report.push(["Total Sessions", attendance.length]);

    const hrs = Math.floor(totalMinutes / 60);

    const mins = totalMinutes % 60;

    report.push(["Total Worked Time", `${hrs}h ${mins}m`]);

    // ===============================
    // CREATE SHEET
    // ===============================

    const worksheet = XLSX.utils.aoa_to_sheet(report);

    // Merge title

    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 6 },
      },
      {
        s: { r: 2, c: 0 },
        e: { r: 2, c: 6 },
      },
    ];

    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 18 },
      { wch: 16 },
      { wch: 16 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 },
    ];

    // ===============================
    // DEFAULT STYLE
    // ===============================

    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cell =
          worksheet[
            XLSX.utils.encode_cell({
              r: R,
              c: C,
            })
          ];

        if (!cell) continue;

        cell.s = {
          font: {
            name: "Calibri",
            sz: 11,
          },

          alignment: {
            horizontal: "center",
            vertical: "center",
          },

          border: {
            top: {
              style: "thin",
            },

            bottom: {
              style: "thin",
            },

            left: {
              style: "thin",
            },

            right: {
              style: "thin",
            },
          },
        };
      }
    }

    // ===============================
    // TITLE STYLE
    // ===============================

    worksheet["A1"].s = {
      font: {
        bold: true,
        sz: 20,
        color: {
          rgb: "D4AF37",
        },
      },

      alignment: {
        horizontal: "center",
      },
    };

    worksheet["A3"].s = {
      font: {
        bold: true,
        sz: 14,
        color: {
          rgb: "1F2937",
        },
      },

      alignment: {
        horizontal: "center",
      },
    };

    // ===============================
    // HEADER STYLE
    // ===============================

    const headerRow = 8;

    ["A", "B", "C", "D", "E", "F", "G"].forEach((col) => {
      const cell = worksheet[`${col}${headerRow}`];

      if (cell) {
        cell.s = {
          font: {
            bold: true,
            color: {
              rgb: "000000",
            },
          },

          fill: {
            fgColor: {
              rgb: "D4AF37",
            },
          },

          alignment: {
            horizontal: "center",
          },

          border: {
            top: {
              style: "thin",
            },

            bottom: {
              style: "thin",
            },

            left: {
              style: "thin",
            },

            right: {
              style: "thin",
            },
          },
        };
      }
    });

    // ===============================
    // WORKBOOK
    // ===============================

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    const today = new Date();

    XLSX.writeFile(
      workbook,
      `Attendance_${staffId}_${today.getFullYear()}_${today.getMonth() + 1}.xlsx`,
    );

    toast.success("Attendance report downloaded successfully!");
  };

  const getActiveRecord = (records) => {
    return records.find((r) => !r.checkOut);
  };

  return (
    <div className="owner-page">
      <div
        className="staff-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1>Attendance History</h1>
          <p>Your complete attendance timeline</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button className="create-btn" onClick={downloadAttendanceExcel}>
            📥 Download Excel
          </button>

          <button className="edit-btn" onClick={() => navigate("/staff")}>
            ← Back Dashboard
          </button>
        </div>
      </div>

      {groupedAttendance.length > 0 ? (
        groupedAttendance.map(([date, records]) => (
          <div className="owner-card" key={date}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2 style={{ marginBottom: "5px" }}>📅 {date}</h2>

                <p
                  style={{
                    color: "#aaa",
                    margin: 0,
                  }}
                >
                  {records.length} Session
                  {records.length > 1 ? "s" : ""}
                </p>
              </div>

              <span
                className={
                  records.some((r) => !r.checkOut)
                    ? "badge-warning"
                    : "badge-success"
                }
              >
                {records.some((r) => !r.checkOut) ? "Working" : "Completed"}
              </span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record, index) => (
                  <tr key={record._id}>
                    <td>{index + 1}</td>

                    <td>
                      {new Date(record.checkIn).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td>
                      {record.checkOut
                        ? new Date(record.checkOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}
                    </td>

                    <td>
                      {record.checkOut ? (
                        <span style={{ color: "#4ade80" }}>✔ Completed</span>
                      ) : (
                        <span style={{ color: "#facc15" }}>🟢 Working</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(255,255,255,.08)",
                paddingTop: "15px",
              }}
            >
              <h3
                style={{
                  color: "#d4af4f",
                  margin: 0,
                }}
              >
                ⏱ Worked Today : {calculateWorkedHours(records)}
              </h3>

              {getActiveRecord(records) && (
                <button
                  className="edit-btn"
                  onClick={() => handleCheckOut(getActiveRecord(records)._id)}
                >
                  Check Out
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="owner-card">
          <h2>No Attendance Records</h2>

          <p>No attendance history available.</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
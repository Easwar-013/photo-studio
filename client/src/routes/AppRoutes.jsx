import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import OwnerDashboard from "../pages/Owner/OwnerDashboard";
import CustomerManagement from "../pages/Owner/CustomerManagement";
import StaffManagement from "../pages/Owner/StaffManagement";
import CreateStaff from "../pages/Owner/CreateStaff";
import JobCardManagement from "../pages/Owner/JobCardManagement";
import AttendanceManagement from "../pages/Owner/AttendanceManagement";
import PayrollManagement from "../pages/Owner/PayrollManagement";
import B2BManagement from "../pages/Owner/B2BManagement";
import Reports from "../pages/Owner/Reports";
import Payments from "../pages/Owner/Payments";

import CustomerDashboard from "../pages/Customer/CustomerDashboard";
import Payment from "../pages/Customer/Payment";

import StaffDashboard from "../pages/Staff/StaffDashboard";
import AvailableJobs from "../pages/Staff/AvailableJobs";
import MyJobs from "../pages/Staff/MyJobs";
import AttendanceHistory from "../pages/Staff/AttendanceHistory";

import B2BDashboard from "../pages/B2B/B2BDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      {/* ================= OWNER ================= */}

      <Route
        path="/owner"
        element={
          <ProtectedRoute role="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/customers"
        element={
          <ProtectedRoute role="owner">
            <CustomerManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/staff"
        element={
          <ProtectedRoute role="owner">
            <StaffManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/create-staff"
        element={
          <ProtectedRoute role="owner">
            <CreateStaff />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobcards"
        element={
          <ProtectedRoute role="owner">
            <JobCardManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute role="owner">
            <AttendanceManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payroll"
        element={
          <ProtectedRoute role="owner">
            <PayrollManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/b2b"
        element={
          <ProtectedRoute role="owner">
            <B2BManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <ProtectedRoute role="owner">
            <Payments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/database"
        element={
          <ProtectedRoute role="owner">
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* ================= STAFF ================= */}

      <Route
        path="/staff"
        element={
          <ProtectedRoute role="staff">
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/available-jobs"
        element={
          <ProtectedRoute role="staff">
            <AvailableJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/my-jobs"
        element={
          <ProtectedRoute role="staff">
            <MyJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/attendance"
        element={
          <ProtectedRoute role="staff">
            <AttendanceHistory />
          </ProtectedRoute>
        }
      />

      {/* ================= CUSTOMER ================= */}

      <Route
        path="/customer"
        element={
          <ProtectedRoute role="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= B2B ================= */}

      <Route
        path="/b2b"
        element={
          <ProtectedRoute role="b2b">
            <B2BDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= PAYMENT ================= */}

      <Route path="/payment" element={<Payment />} />

      {/* ================= INVALID URL ================= */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;

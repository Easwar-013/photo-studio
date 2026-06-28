import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const storedRole = localStorage.getItem("role");

  if (!storedRole) {
    return <Navigate to="/login" replace />;
  }

  if (storedRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

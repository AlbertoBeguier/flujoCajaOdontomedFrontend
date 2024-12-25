import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { isAuthenticated } from "../../services/authService";
import { useInactivityTimer } from "../../hooks/useInactivityTimer";

export const ProtectedRoute = ({ children }) => {
  useInactivityTimer(30); // 30 minutos de inactividad

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

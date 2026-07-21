import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './RequireAuth';

/**
 * For public auth pages (login / signup).
 * If the user already has a session, send them to /upload
 * instead of letting them sit on login and jump elsewhere.
 */
const RequireGuest = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/upload" replace />;
  }

  return children;
};

export default RequireGuest;

import { Navigate, useLocation } from 'react-router-dom';

function isAuthenticated() {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return Boolean(token && user);
  } catch {
    return false;
  }
}

/**
 * Blocks unauthenticated access. Redirects to /login and
 * remembers the intended destination for optional post-login redirect.
 */
const RequireAuth = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default RequireAuth;
export { isAuthenticated };

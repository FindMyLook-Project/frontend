import { Navigate, useLocation } from 'react-router-dom';

/**
 * Ensures /results was reached via Upload navigation with search payload
 * in location.state — not by typing the URL or refreshing with empty state.
 */
function hasValidResultsState(state) {
  if (!state || typeof state !== 'object') return false;

  if (state.mode === 'totalLook' && state.totalLook) return true;

  if (Array.isArray(state.searchResults) && state.searchResults.length > 0) return true;

  return false;
}

const RequireResults = ({ children }) => {
  const location = useLocation();

  if (!hasValidResultsState(location.state)) {
    return <Navigate to="/upload" replace />;
  }

  return children;
};

export default RequireResults;

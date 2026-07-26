/**
 * Legacy/unused router file. The live route tree is defined in src/App.jsx.
 * Kept to avoid breaking imports; do not add new routes here.
 */
import { Navigate } from 'react-router-dom';

const AppRoutes = () => <Navigate to="/login" replace />;

export default AppRoutes;

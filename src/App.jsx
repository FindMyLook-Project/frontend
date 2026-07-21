import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Upload from './pages/Upload';
import Results from './pages/Results';
import SavedItems from './pages/SavedItems';
import RequireAuth from './components/RequireAuth';
import RequireGuest from './components/RequireGuest';
import RequireResults from './components/RequireResults';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public — only when logged out */}
        <Route
          path="/login"
          element={
            <RequireGuest>
              <Login />
            </RequireGuest>
          }
        />
        <Route
          path="/signup"
          element={
            <RequireGuest>
              <Signup />
            </RequireGuest>
          }
        />

        {/* Auth required */}
        <Route
          path="/upload"
          element={
            <RequireAuth>
              <Upload />
            </RequireAuth>
          }
        />
        <Route
          path="/saved"
          element={
            <RequireAuth>
              <SavedItems />
            </RequireAuth>
          }
        />

        {/* Auth + completed search flow required */}
        <Route
          path="/results"
          element={
            <RequireAuth>
              <RequireResults>
                <Results />
              </RequireResults>
            </RequireAuth>
          }
        />

        {/* Unknown paths */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

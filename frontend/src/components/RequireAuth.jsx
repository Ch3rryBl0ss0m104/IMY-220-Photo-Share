import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// unregistered/logged-out user can only reach the splash page. Every other route is wrapped in this guard.
function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">loading…</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireAuth;

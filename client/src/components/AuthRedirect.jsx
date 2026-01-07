import { Navigate } from 'react-router-dom';
import useAuthStore from '../state/authStore';

/**
 * Redirects authenticated users to /map, unauthenticated users to /login
 */
function AuthRedirect() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/map" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default AuthRedirect;

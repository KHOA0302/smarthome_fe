import { Navigate, Outlet } from "react-router-dom";
import authService from "../../api/authService";

function ProtectedRoute({ allowedRoles }) {
  const isAuthenticated = authService.isAuthenticated();

  const currentUser = authService.getCurrentUser();
  const currentUserRoleId = currentUser ? currentUser.role_id : null;

  let hasRequiredRole = true;
  if (allowedRoles && allowedRoles.length > 0) {
    hasRequiredRole = allowedRoles.includes(currentUserRoleId);
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!hasRequiredRole) {
    console.warn(
      `Access Denied: User with Role ID ${currentUserRoleId} attempted to access restricted content. Required roles: ${allowedRoles}.`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

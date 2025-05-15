import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

function AuthRedirect() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/products" /> : <Navigate to="/login" />;
}

export default AuthRedirect;

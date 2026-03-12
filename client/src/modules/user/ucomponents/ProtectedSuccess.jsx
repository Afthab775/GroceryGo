import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedSuccess({ children }) {
  const location = useLocation();

  if (!location.state?.fromOrder) {
    return <Navigate to="/" replace />;
  }

  return children;
}
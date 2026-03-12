import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedCheckout({ children }) {
  const location = useLocation();

  if (!location.state?.fromCart) {
    return <Navigate to="/" replace />;
  }

  return children;
}
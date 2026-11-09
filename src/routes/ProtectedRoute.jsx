import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "@/contexts/ProfileContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useProfile();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
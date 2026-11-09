import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "@/contexts/ProfileContext";

export default function RequireProfile() {
  const { profile } = useProfile();

  if (!profile || !profile.village) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Outlet />;
}

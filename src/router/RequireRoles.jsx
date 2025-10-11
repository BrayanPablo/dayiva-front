import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireRoles = ({ allowed }) => {
  const { role } = useAuth();
  console.log("[REQUIREROLES] role:", role);

  if (typeof role !== "string") {
    return <div style={{ padding: 40, textAlign: "center" }}>Cargando...</div>;
  }

  const allowedLower = allowed.map(r => r.toLowerCase());
  if (!allowedLower.includes(role.toLowerCase())) {
    return <Navigate to="/403" />;
  }

  return <Outlet />;
};

export default RequireRoles;
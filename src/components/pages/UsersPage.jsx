

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserForm from "../Usuarios/UserForm";
import UserList from "../Usuarios/UserList";


const UsersPage = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  console.log("[USERSPAGE] isAuthenticated:", isAuthenticated, "role:", role);
  if (!isAuthenticated || role?.toLowerCase() !== "admin") {
    navigate("/403");
  }
}, [isAuthenticated, role, navigate]);

  if (!isAuthenticated || role?.toLowerCase() !== "admin") {
    return null;
  }
   console.log("[USERSPAGE] Render", { isAuthenticated, role });
  const [showModal, setShowModal] = React.useState(false);
  const [refreshUsers, setRefreshUsers] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-start justify-start pt-8 w-full">
      <div className="w-full flex flex-col gap-4 pt-2">
        <div className="flex items-center justify-between mb-2 w-full">
          <h1 className="text-3xl font-bold text-blue-700">Usuarios</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow flex items-center gap-2 border-2 border-yellow-400 text-lg"
            onClick={() => setShowModal(true)}
          >
            <span className="text-2xl">＋</span>
            <span>Nuevo Registro</span>
          </button>
        </div>
        <div className="w-full pb-4 flex-1 flex items-start">
          <UserList refresh={refreshUsers} />
        </div>
      </div>

      {/* Modal para formulario de usuario */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "transparent" }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl border-4 border-blue-600 relative">
            <button
              className="absolute top-3 right-3 text-blue-600 hover:text-blue-900 text-2xl font-bold"
              onClick={() => setShowModal(false)}
              title="Cerrar"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Registrar Usuario</h2>
            <UserForm onSuccess={() => { setShowModal(false); setRefreshUsers(r => !r); }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;

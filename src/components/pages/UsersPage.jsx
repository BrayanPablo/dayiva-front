

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
    <div className="w-full max-w-full px-3 md:px-6 lg:px-8">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold mb-0 text-gray-800">Usuarios</h2>
        <button
          className="btn btn-primary text-base-100 font-bold py-3 px-6 rounded-lg shadow flex items-center gap-2 border-2 border-yellow-400 text-lg"
          onClick={() => setShowModal(true)}
        >
          <span className="text-2xl">＋</span>
          <span>Nuevo Registro</span>
        </button>
      </div>

      <div className="rounded-2xl shadow-lg border-2 border-blue-400 bg-white w-full">
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
        </div>
        <div className="p-6">
          <UserList refresh={refreshUsers} />
        </div>
      </div>

      {/* Modal para formulario de usuario */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-300/60 backdrop-blur-sm">
          <div className="bg-base-100 rounded-2xl shadow-xl p-8 w-full max-w-3xl border border-base-200 relative">
            <button
              className="absolute top-3 right-3 text-primary hover:opacity-80 text-2xl font-bold"
              onClick={() => setShowModal(false)}
              title="Cerrar"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-base-content">Registrar Usuario</h2>
            <UserForm onSuccess={() => { setShowModal(false); setRefreshUsers(r => !r); }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;

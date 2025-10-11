import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import DataTable from "../shared/DataTable";

export default function UserList({ refresh }) {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar usuario");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold mb-8 text-black-700">Lista de Usuarios</h2>
        {error && <div className="text-red-600 text-sm font-medium mb-2">{error}</div>}
        {/* Configuración de columnas para DataTable */}
        {(() => {
          const columns = [
            {
              key: 'first_name',
              label: 'Nombres',
              sortable: true
            },
            {
              key: 'last_name',
              label: 'Apellidos',
              sortable: true
            },
            {
              key: 'username',
              label: 'Usuario',
              sortable: true
            },
            {
              key: 'role',
              label: 'Rol',
              sortable: true,
              render: (value) => (
                <span className="bg-blue-200 text-blue-800 px-3 py-2 rounded-full text-base">
                  {value}
                </span>
              )
            },
            {
              key: 'status',
              label: 'Estado',
              sortable: true,
              render: (value) => (
                <span className={`text-base px-3 py-2 rounded-full ${
                  value === "Activo" || value === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {value}
                </span>
              )
            }
          ];

          const searchFields = ['first_name', 'last_name', 'username'];

          return (
            <div className="rounded-2xl shadow-lg border-2 border-yellow-400 bg-white w-full">
              <DataTable
                data={users}
                columns={columns}
                searchFields={searchFields}
                itemsPerPage={10}
                onEdit={handleEdit}
                onDelete={(user) => handleDelete(user.id)}
                loading={false}
                className="border-0"
              />
            </div>
          );
        })()}
        {/* Modal de edición */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "transparent" }}>
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-4 border-blue-600 relative">
              <button
                className="absolute top-3 right-3 text-blue-600 hover:text-blue-900 text-2xl font-bold"
                onClick={() => { setShowEditModal(false); setEditUser(null); }}
                title="Cerrar"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-blue-700">Editar Usuario</h2>
              <UserForm
                user={editUser}
                onSuccess={() => {
                  setShowEditModal(false);
                  setEditUser(null);
                  fetchUsers();
                }}
                isEdit
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

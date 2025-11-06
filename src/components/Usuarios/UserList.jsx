import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import { apiGet, apiDelete } from "../../utils/api";

export default function UserList({ refresh }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  // Filtrar usuarios cuando cambie el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.status && user.status.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1); // Reset a la primera página cuando se busca
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const res = await apiGet("/api/users");
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const res = await apiDelete(`/api/users/${id}`);
      if (!res.ok) throw new Error("Error al eliminar usuario");
      setUsers(users.filter((u) => u.id !== id));
      setFilteredUsers(filteredUsers.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  // Manejar cambio de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="w-full">
      {/* Barra de búsqueda */}
      <div className="w-full mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, usuario, rol o estado..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="input input-bordered w-full pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full pb-4 flex-1 flex items-start">
        <div className="w-full">
          <div className="w-full">
            <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900">Lista de Usuarios</h3>
              </div>
              
              <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-130px)]">
                <table className="table table-sm w-full">
                  <thead className="">
                    <tr>
                      <th className="p-4 text-left text-xs font-semibold uppercase">
                        Nombres
                      </th>
                      <th className="p-4 text-left text-xs font-semibold uppercase">
                        Apellidos
                      </th>
                      <th className="p-4 text-left text-xs font-semibold uppercase">
                        Usuario
                      </th>
                      <th className="p-4 text-center text-xs font-semibold uppercase">
                        Rol
                      </th>
                      <th className="p-4 text-center text-xs font-semibold uppercase">
                        Estado
                      </th>
                      <th className="p-4 text-center text-xs font-semibold uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-6 text-center opacity-70">
                          {searchTerm ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => (
                        <tr key={user.id} className="hover">
                          <td className="p-4">
                            <div className="font-medium text-gray-900">
                              {user.first_name || 'N/A'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900">
                              {user.last_name || 'N/A'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-600">
                              {user.username || 'N/A'}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-sm px-3 py-1 rounded-full font-medium bg-blue-200 text-blue-800 border border-blue-300">
                              {user.role || 'N/A'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                              user.status === 'Activo' || user.status === 'active' ? 'bg-green-200 text-green-800 border border-green-300' : 
                              user.status === 'Inactivo' || user.status === 'inactive' ? 'bg-red-200 text-red-800 border border-red-300' :
                              'bg-gray-200 text-gray-800 border border-gray-300'
                            }`}>
                              {user.status || 'N/A'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-3 justify-center items-center">
                              <button
                                onClick={() => handleEdit(user)}
                                className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                                title="Editar usuario"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                                title="Eliminar usuario"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Controles de paginación */}
              {filteredUsers.length > usersPerPage && (
                <div className="px-6 py-3 bg-base-100 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-70">
                      Mostrando {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} usuarios
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="btn btn-sm btn-outline"
                      >
                        Anterior
                      </button>
                      <span className="flex items-center px-3 text-sm">
                        Página {currentPage} de {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="btn btn-sm btn-outline"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
  );
}

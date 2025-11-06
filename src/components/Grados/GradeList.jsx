import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import GradeService from '../services/GradeService';

const GradeList = ({ onEdit, onRefresh, refreshKey }) => {
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const gradesPerPage = 10;
  const { show } = useToast();

  useEffect(() => {
    fetchGrades();
  }, []);

  // Actualizar la lista cuando cambie el refreshKey
  useEffect(() => {
    if (refreshKey && refreshKey > 0) {
      fetchGrades();
    }
  }, [refreshKey]);

  // Filtrar grados cuando cambie el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredGrades(grades);
    } else {
      const filtered = grades.filter(grade => 
        (grade.nombre && grade.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (grade.nivel && grade.nivel.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (grade.estado && grade.estado.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredGrades(filtered);
    }
    setCurrentPage(1); // Reset a la primera página cuando se busca
  }, [searchTerm, grades]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const data = await GradeService.getAllGrades();
      setGrades(data);
      setFilteredGrades(data);
    } catch (error) {
      console.error('Error al cargar grados:', error);
      show({ title: 'Error', message: 'No se pudieron cargar los grados', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este grado?')) {
      try {
        await GradeService.deleteGrade(id);
        show({ title: 'Éxito', message: 'Grado eliminado correctamente', type: 'success' });
        fetchGrades(); // Actualizar la lista local
        if (onRefresh) onRefresh(); // Notificar al componente padre para actualizar
      } catch (error) {
        console.error('Error al eliminar grado:', error);
        const errorMessage = error.message.includes('no encontrado') 
          ? 'El grado no existe o ya fue eliminado' 
          : 'No se pudo eliminar el grado';
        show({ title: 'Error', message: errorMessage, type: 'error' });
      }
    }
  };

  const handleEdit = (grade) => {
    if (onEdit) onEdit(grade);
  };

  // Manejar cambio de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Paginación
  const totalPages = Math.ceil(filteredGrades.length / gradesPerPage);
  const startIndex = (currentPage - 1) * gradesPerPage;
  const endIndex = startIndex + gradesPerPage;
  const currentGrades = filteredGrades.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Barra de búsqueda */}
      <div className="w-full mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, nivel o estado..."
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
                <h3 className="text-lg font-semibold text-gray-900">Lista de Grados</h3>
              </div>
              
              <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-130px)]">
                <table className="table table-sm w-full">
                  <thead className="">
                    <tr>
                      <th className="p-4 text-left text-xs font-semibold uppercase">
                        Nombre
                      </th>
                      <th className="p-4 text-left text-xs font-semibold uppercase">
                        Nivel
                      </th>
                      <th className="p-4 text-left text-xs font-semibold uppercase">
                        Capacidad
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
                    {currentGrades.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-6 text-center opacity-70">
                          {searchTerm ? 'No se encontraron grados con ese criterio' : 'No hay grados registrados'}
                        </td>
                      </tr>
                    ) : (
                      currentGrades.map((grade) => (
                        <tr key={grade.id_grado} className="hover">
                          <td className="p-4">
                            <div className="font-medium text-gray-900">
                              {grade.nombre || 'N/A'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-600">
                              {grade.nivel || 'N/A'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-600">
                              {grade.capacidad || '-'}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                              grade.estado === 'Activo' ? 'bg-green-200 text-green-800 border border-green-300' : 
                              grade.estado === 'Inactivo' ? 'bg-red-200 text-red-800 border border-red-300' :
                              'bg-gray-200 text-gray-800 border border-gray-300'
                            }`}>
                              {grade.estado || 'N/A'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-3 justify-center items-center">
                              <button
                                onClick={() => handleEdit(grade)}
                                className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                                title="Editar grado"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(grade.id_grado)}
                                className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                                title="Eliminar grado"
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
              {filteredGrades.length > gradesPerPage && (
                <div className="px-6 py-3 bg-base-100 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-70">
                      Mostrando {startIndex + 1} a {Math.min(endIndex, filteredGrades.length)} de {filteredGrades.length} grados
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
    </div>
  );
};

export default GradeList;

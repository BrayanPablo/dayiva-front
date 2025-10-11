import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudents, updateStudent, deleteStudent, getStudentById } from "../services/StudentService";
import StudentDetails from "./StudentDetails";
import Button from "../shared/Button";
import DataTable from "../shared/DataTable";
import { useToast } from "../ui/Toast";

const StudentForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    fetchStudents()
      .then(data => {
        setStudents(data);
        setFilteredStudents(data);
      })
      .catch(() => {
        setStudents([]);
        setFilteredStudents([]);
      });
  }, []);

  // Filtrar estudiantes cuando cambie el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        (student.full_name && student.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.surnames && student.surnames.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.identity_document && student.identity_document.includes(searchTerm))
      );
      setFilteredStudents(filtered);
    }
    setCurrentPage(1); // Reset a la primera página cuando se busca
  }, [searchTerm, students]);

  const handleViewDetails = async (student) => {
    console.log('Abriendo detalles del estudiante:', student);
    try {
      // Obtener datos completos del estudiante incluyendo apoderados
      const fullStudentData = await getStudentById(student.id);
      console.log('Datos completos del estudiante:', fullStudentData);
      console.log('🔍 DEBUGGING - father_dni en datos completos:', fullStudentData?.father_dni);
      console.log('🔍 DEBUGGING - father_first_name en datos completos:', fullStudentData?.father_first_name);
      console.log('🔍 DEBUGGING - mother_dni en datos completos:', fullStudentData?.mother_dni);
      console.log('🔍 DEBUGGING - mother_first_name en datos completos:', fullStudentData?.mother_first_name);
      setSelectedStudent(fullStudentData);
      setShowDetails(true);
    } catch (error) {
      console.error('Error al obtener datos del estudiante:', error);
      toast.show({ title: 'Error', message: 'No se pudieron cargar los datos del estudiante', type: 'error' });
    }
  };

  const handleUpdateStudent = async (updatedData) => {
    try {
      // Obtener datos actualizados del estudiante desde el backend
      const updatedStudent = await getStudentById(selectedStudent.id);
      
      setStudents(prev => prev.map(stu => 
        stu.id === selectedStudent.id ? { ...stu, ...updatedStudent } : stu
      ));
      setFilteredStudents(prev => prev.map(stu => 
        stu.id === selectedStudent.id ? { ...stu, ...updatedStudent } : stu
      ));
      setShowDetails(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error al actualizar lista de estudiantes:', error);
      // Fallback: actualizar con los datos que tenemos
      setStudents(prev => prev.map(stu => 
        stu.id === selectedStudent.id ? { ...stu, ...updatedData } : stu
      ));
      setFilteredStudents(prev => prev.map(stu => 
        stu.id === selectedStudent.id ? { ...stu, ...updatedData } : stu
      ));
      setShowDetails(false);
      setSelectedStudent(null);
    }
  };

  // Funciones de paginación
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este estudiante?")) {
      try {
        await deleteStudent(studentId);
        setStudents(prev => prev.filter(stu => stu.id !== studentId));
        setFilteredStudents(prev => prev.filter(stu => stu.id !== studentId));
        toast.show({ 
          title: "Estudiante eliminado", 
          message: "El estudiante ha sido eliminado correctamente", 
          type: "success", 
          duration: 3000 
        });
      } catch (error) {
        console.error("Error al eliminar estudiante:", error);
        toast.show({ 
          title: "Error", 
          message: "Error al eliminar el estudiante", 
          type: "error", 
          duration: 4000 
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-start justify-start pt-8 w-full">
      <div className="w-full flex flex-col gap-4 pt-2">
        <div className="flex items-center justify-between mb-2 w-full">
          <h2 className="text-3xl font-bold text-blue-700">Estudiantes</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow flex items-center gap-2 border-2 border-yellow-400 text-lg"
            onClick={() => navigate("/students/register")}
          >
            <span className="text-2xl">＋</span>
            <span>Agregar Estudiante</span>
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="w-full mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o DNI..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900">Lista de Estudiantes</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Apellidos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Nombres
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          DNI
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Acciones
                        </th>
                    </tr>
                  </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentStudents.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            {searchTerm ? 'No se encontraron estudiantes con ese criterio' : 'No hay estudiantes registrados'}
                          </td>
                        </tr>
                    ) : (
                      currentStudents.map((stu) => (
                          <tr key={stu.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 break-words text-sm text-gray-900 max-w-xs">
                              {stu.surnames}
                            </td>
                            <td className="px-6 py-4 break-words text-sm text-blue-700 font-semibold max-w-xs">
                              {stu.full_name}
                            </td>
                            <td className="px-6 py-4 break-words text-sm text-gray-900 max-w-xs">
                              {stu.identity_document}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                stu.status === 'Activo' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {stu.status}
                            </span>
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewDetails(stu)}
                                  className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                                  title="Ver detalles completos"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                            <button
                                  onClick={() => handleViewDetails(stu)}
                                  className="text-yellow-600 hover:text-yellow-900 p-2 rounded-md hover:bg-yellow-50 transition-colors"
                                  title="Editar estudiante"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                            </button>
                            <button
                                  onClick={() => handleDeleteStudent(stu.id)}
                                  className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                                  title="Eliminar estudiante"
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
                {filteredStudents.length > studentsPerPage && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Mostrando {startIndex + 1} a {Math.min(endIndex, filteredStudents.length)} de {filteredStudents.length} estudiantes
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        
                        {/* Números de página */}
                        <div className="flex space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Modal de detalles del estudiante */}
        {showDetails && selectedStudent && (
          <div className="fixed inset-0 z-50">
            <StudentDetails
              student={selectedStudent}
              onClose={() => {
                setShowDetails(false);
                setSelectedStudent(null);
              }}
              onUpdate={handleUpdateStudent}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentForm;

import React, { useState, useEffect } from "react";
import { useToast } from "../ui/Toast";

const StudentSearchModal = ({ isOpen, onClose, onSelectStudent, title = "Buscar Estudiante" }) => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStudents();
    }
  }, [isOpen]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/students");
      if (!response.ok) throw new Error("Error al cargar estudiantes");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      toast.show({
        title: "Error",
        message: "Error al cargar la lista de estudiantes",
        type: "error",
        duration: 3500
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.full_name || ''} ${student.surnames || ''}`.toLowerCase();
    const dni = student.identity_document || '';
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || dni.includes(search);
  });

  const handleSelectStudent = (student) => {
    onSelectStudent(student);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[80vh] relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>

        <div className="overflow-x-auto max-h-96">
          {loading ? (
            <div className="text-center py-8">Cargando estudiantes...</div>
          ) : (
            <table className="min-w-full border text-left text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border-b">DNI</th>
                  <th className="p-3 border-b">Nombres</th>
                  <th className="p-3 border-b">Apellidos</th>
                  <th className="p-3 border-b">Fecha Nacimiento</th>
                  <th className="p-3 border-b">Sexo</th>
                  <th className="p-3 border-b">Ciudad</th>
                  <th className="p-3 border-b">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{student.identity_document}</td>
                    <td className="p-3">{student.full_name}</td>
                    <td className="p-3">{student.surnames}</td>
                    <td className="p-3">
                      {student.birth_date ? new Date(student.birth_date).toLocaleDateString() : ''}
                    </td>
                    <td className="p-3">{student.gender}</td>
                    <td className="p-3">{student.city}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleSelectStudent(student)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filteredStudents.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron estudiantes
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSearchModal;

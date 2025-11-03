import React, { useState, useEffect } from "react";
import { useToast } from "../ui/Toast";
import { apiGet } from "../../utils/api";

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
      const response = await apiGet("/api/students");
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
    const fullName = `${student.nombres || student.full_name || ''} ${student.apellidos || student.surnames || ''}`.toLowerCase();
    const dni = (student.dni || student.identity_document || '').toString();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || dni.includes(search);
  });

  const handleSelectStudent = (student) => {
    onSelectStudent(student);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-300/60 backdrop-blur-sm">
      <div className="bg-base-100 rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[80vh] relative border border-base-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-base-content">{title}</h2>
          <button 
            className="text-base-content/70 hover:text-base-content text-2xl"
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
            className="w-full px-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            autoFocus
          />
        </div>

        <div className="overflow-x-auto max-h-96">
          {loading ? (
            <div className="text-center py-8">Cargando estudiantes...</div>
          ) : (
            <table className="min-w-full border text-left text-sm">
              <thead>
                <tr className="bg-base-200">
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
                {filteredStudents.map((student, index) => (
                  <tr key={student.estudiante_id || student.id || `student-${index}`} className="border-b hover:bg-base-200/60">
                    <td className="p-3">{student.dni || student.identity_document}</td>
                    <td className="p-3">{student.nombres || student.full_name}</td>
                    <td className="p-3">{student.apellidos || student.surnames}</td>
                    <td className="p-3">
                      {student.fecha_nacimiento || student.birth_date ? new Date(student.fecha_nacimiento || student.birth_date).toLocaleDateString() : ''}
                    </td>
                    <td className="p-3">{student.sexo || student.gender}</td>
                    <td className="p-3">{student.ciudad || student.city}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleSelectStudent(student)}
                        className="btn btn-success btn-sm"
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
          <div className="text-center py-8 text-base-content/60">
            No se encontraron estudiantes
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSearchModal;

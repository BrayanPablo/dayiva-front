import React, { useState, useEffect } from "react";
import { useToast } from "../ui/Toast";
import { fetchEnrollments, deleteEnrollment, downloadEnrollmentReceipt } from "../services/EnrollmentService";
import DataTable from "../shared/DataTable";

const EnrollmentList = ({ refresh }) => {
  const toast = useToast();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const data = await fetchEnrollments();
      setEnrollments(data);
    } catch (err) {
      toast.show({ title: "Error", message: err.message, type: "error", duration: 3500 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta matrícula?")) return;
    try {
      await deleteEnrollment(id);
      setEnrollments(prev => prev.filter(e => e.id !== id));
      toast.show({ title: "Matrícula eliminada", message: "Se eliminó correctamente", type: "success", duration: 2500 });
    } catch (err) {
      toast.show({ title: "Error", message: err.message, type: "error", duration: 3500 });
    }
  };

  const handleDownloadReceipt = async (enrollment) => {
    try {
      await downloadEnrollmentReceipt(enrollment.id);
      toast.show({ title: "Comprobante descargado", message: "El PDF se ha descargado correctamente", type: "success", duration: 3000 });
    } catch (err) {
      toast.show({ title: "Error", message: "Error al descargar comprobante", type: "error", duration: 3000 });
    }
  };

  // Configuración de columnas para DataTable
  const columns = [
    {
      key: 'student',
      label: 'Estudiante',
      sortable: true
    },
    {
      key: 'grade',
      label: 'Grado',
      sortable: true
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => (
        <span className={`text-sm px-3 py-1 rounded-full ${
          value === 'Activo' ? 'bg-green-100 text-green-700' : 
          value === 'Retirado' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {value}
        </span>
      )
    }
  ];

  // Campos de búsqueda
  const searchFields = ['student', 'grade'];

  // Manejar acciones
  const handleView = (enrollment) => {
    alert('Ver detalles — por implementar');
  };

  const handleEdit = (enrollment) => {
    alert('Funcionalidad de edición pendiente');
  };

  return (
    <div className="rounded-2xl shadow-lg border-2 border-yellow-400 bg-white w-full">
      <DataTable
        data={enrollments}
        columns={columns}
        searchFields={searchFields}
        itemsPerPage={10}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDownload={handleDownloadReceipt}
        loading={loading}
        className="border-0"
      />
    </div>
  );
};

export default EnrollmentList;

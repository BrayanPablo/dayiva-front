import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import GradeService from '../services/GradeService';
import DataTable from '../shared/DataTable';

const GradeList = ({ onEdit, onRefresh, refreshKey }) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const data = await GradeService.getAllGrades();
      setGrades(data);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Configuración de columnas para DataTable
  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'nivel',
      label: 'Nivel',
      sortable: true
    },
    {
      key: 'capacidad',
      label: 'Capacidad',
      sortable: true,
      render: (value) => value || '-'
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Activo' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  // Campos de búsqueda
  const searchFields = ['nombre', 'nivel'];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900">Lista de Grados</h3>
      </div>
      
      <DataTable
        data={grades}
        columns={columns}
        searchFields={searchFields}
        itemsPerPage={10}
        onEdit={handleEdit}
        onDelete={(grade) => handleDelete(grade.id_grado)}
        loading={loading}
        className="border-0"
      />
    </div>
  );
};

export default GradeList;

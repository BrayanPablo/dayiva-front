import React, { useState, useEffect } from 'react';
import DataTable from '../shared/DataTable';
import Button from '../shared/Button';

const ExampleDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Datos de ejemplo
  const sampleData = [
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', phone: '987654321', status: 'Activo' },
    { id: 2, name: 'María García', email: 'maria@email.com', phone: '987654322', status: 'Inactivo' },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com', phone: '987654323', status: 'Activo' },
    { id: 4, name: 'Ana Martínez', email: 'ana@email.com', phone: '987654324', status: 'Activo' },
    { id: 5, name: 'Luis Rodríguez', email: 'luis@email.com', phone: '987654325', status: 'Inactivo' }
  ];

  // Cargar datos
  useEffect(() => {
    setLoading(true);
    // Simular carga de datos
    setTimeout(() => {
      setData(sampleData);
      setLoading(false);
    }, 1000);
  }, []);

  // Configuración de columnas
  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'name',
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'phone',
      label: 'Teléfono',
      sortable: true
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
  const searchFields = ['name', 'email', 'phone'];

  // Manejar acciones
  const handleView = (item) => {
    alert(`Ver detalles de: ${item.name}`);
  };

  const handleEdit = (item) => {
    alert(`Editar: ${item.name}`);
  };

  const handleDelete = (item) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${item.name}?`)) {
      setData(prev => prev.filter(d => d.id !== item.id));
      alert(`${item.name} eliminado`);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Tabla de Ejemplo</h2>
        <p className="text-gray-600">Ejemplo de DataTable reutilizable con búsqueda, ordenamiento y paginación</p>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchFields={searchFields}
        itemsPerPage={3}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Características implementadas:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✅ Búsqueda en tiempo real</li>
          <li>✅ Ordenamiento por columnas</li>
          <li>✅ Paginación automática</li>
          <li>✅ Acciones personalizables (Ver, Editar, Eliminar)</li>
          <li>✅ Renderizado personalizado de celdas</li>
          <li>✅ Estado de carga</li>
        </ul>
      </div>
    </div>
  );
};

export default ExampleDataTable;

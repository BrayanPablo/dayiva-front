import React, { useState } from 'react';
import GradeList from '../Grados/GradeList';
import GradeForm from '../Grados/GradeForm';
import Button from '../shared/Button';

const GradesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddGrade = () => {
    setEditingGrade(null);
    setShowForm(true);
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGrade(null);
  };

  const handleFormSuccess = () => {
    setRefreshKey(prev => prev + 1); // Forzar re-render de la lista
    setShowForm(false);
    setEditingGrade(null);
  };

  return (
    <div className="w-full max-w-full px-3 md:px-6 lg:px-8">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold mb-0 text-gray-800">Gestión de Grados</h2>
        <Button
          variant="primary"
          size="large"
          onClick={handleAddGrade}
          className="px-6 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Grado
        </Button>
      </div>

      <div className="rounded-2xl shadow-lg border-2 border-blue-400 bg-white w-full">
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Grados</h3>
        </div>
        <div className="p-6">
          <GradeList 
            onEdit={handleEditGrade}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
            refreshKey={refreshKey}
          />
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <GradeForm
          grade={editingGrade}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default GradesPage;
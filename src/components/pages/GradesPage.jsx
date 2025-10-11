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
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Grados</h1>
              <p className="mt-2 text-gray-600">
                Administra los grados y niveles educativos de la institución
              </p>
            </div>
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
        </div>

        {/* Content */}
        <div className="space-y-6">
          <GradeList 
            onEdit={handleEditGrade}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
            refreshKey={refreshKey}
          />
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
    </div>
  );
};

export default GradesPage;
import React from "react";
import EnrollmentForm from "../Enrollments/EnrollmentForm";
import EnrollmentList from "../Enrollments/EnrollmentList";
import Button from "../shared/Button";

export default function EnrollmentsPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [refreshEnrollments, setRefreshEnrollments] = React.useState(false);

  const handleNewEnrollment = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setRefreshEnrollments(r => !r);
  };

  // Si se está mostrando el formulario, ocultar el dashboard y mostrar en pantalla completa
  if (showForm) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <div className="min-h-screen bg-gray-100">
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Sistema de Matrículas</h1>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                title="Cerrar"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6">
            <EnrollmentForm onSuccess={handleFormSuccess} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-3 md:px-6 lg:px-8">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold mb-0 text-black-700">Estudiantes Matriculados</h2>
        <Button
          variant="primary"
          size="large"
          onClick={handleNewEnrollment}
          className="px-6"
        >
          + Nueva Matrícula
        </Button>
      </div>

      <EnrollmentList refresh={refreshEnrollments} />
    </div>
  );
}

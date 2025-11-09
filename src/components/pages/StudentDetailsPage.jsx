import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import { getStudentById } from '../services/StudentService';

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        const studentData = await getStudentById(id);
        setStudent(studentData);
      } catch (error) {
        console.error('Error al cargar detalles del estudiante:', error);
        toast.show({
          title: "Error",
          message: "No se pudieron cargar los detalles del estudiante",
          type: "error",
          duration: 3500
        });
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadStudent();
    }
  }, [id, navigate, toast]);

  // Helper para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Helper para mostrar valor o placeholder
  const showValue = (value, placeholder = 'No especificado') => {
    if (value === null || value === undefined) return placeholder;
    const normalized = String(value).trim();
    return normalized !== '' ? normalized : placeholder;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del estudiante...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Estudiante no encontrado</h2>
          <button
            onClick={() => navigate('/students')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver a Estudiantes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📋 Detalles del Estudiante
              </h1>
              <p className="mt-2 text-gray-600">
                {showValue(`${student.full_name || ''} ${student.surnames || ''}`.trim())}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/students')}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                ← Volver
              </button>
              <button
                onClick={() => navigate(`/students/edit/${student.id}`)}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                ✏️ Editar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Información Personal */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              👤 Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Código del Estudiante</label>
                <p className="text-gray-900 font-medium">{showValue(student.school_code)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Nombres Completos</label>
                <p className="text-gray-900 font-medium">{showValue(student.full_name)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Apellidos</label>
                <p className="text-gray-900 font-medium">{showValue(student.surnames)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">DNI</label>
                <p className="text-gray-900 font-medium">{showValue(student.identity_document)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Fecha de Nacimiento</label>
                <p className="text-gray-900 font-medium">{formatDate(student.birth_date)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Edad</label>
                <p className="text-gray-900 font-medium">{showValue(student.age)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Sexo</label>
                <p className="text-gray-900 font-medium">{showValue(student.gender)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Estado</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  student.status === 'Activo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {showValue(student.status)}
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Grado Actual</label>
                <p className="text-gray-900 font-medium">{showValue(student.grade_name)}</p>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
              📍 Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Ciudad</label>
                <p className="text-gray-900 font-medium">{showValue(student.city)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Teléfono</label>
                <p className="text-gray-900 font-medium">{showValue(student.phone_number)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Dirección</label>
                <p className="text-gray-900 font-medium">{showValue(student.address)}</p>
              </div>
            </div>
          </div>

          {/* Información Familiar */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
              👨‍👩‍👧‍👦 Información Familiar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Información del Padre */}
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                  👨 Padre
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Nombre Completo</label>
                    <p className="text-gray-900 font-medium">{showValue(student.father_full_name)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">DNI</label>
                    <p className="text-gray-900 font-medium">{showValue(student.father_dni)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Teléfono</label>
                    <p className="text-gray-900 font-medium">{showValue(student.father_phone)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Email</label>
                    <p className="text-gray-900 font-medium">{showValue(student.father_email)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Profesión</label>
                    <p className="text-gray-900 font-medium">{showValue(student.father_profession)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Ocupación</label>
                    <p className="text-gray-900 font-medium">{showValue(student.father_occupation)}</p>
                  </div>
                </div>
              </div>

              {/* Información de la Madre */}
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-pink-400">
                <h4 className="text-lg font-bold text-pink-800 mb-3 flex items-center">
                  👩 Madre
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Nombre Completo</label>
                    <p className="text-gray-900 font-medium">{showValue(student.mother_full_name)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">DNI</label>
                    <p className="text-gray-900 font-medium">{showValue(student.mother_dni)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Teléfono</label>
                    <p className="text-gray-900 font-medium">{showValue(student.mother_phone)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Email</label>
                    <p className="text-gray-900 font-medium">{showValue(student.mother_email)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Profesión</label>
                    <p className="text-gray-900 font-medium">{showValue(student.mother_profession)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Ocupación</label>
                    <p className="text-gray-900 font-medium">{showValue(student.mother_occupation)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información Académica y Salud */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
              🎓 Información Académica y Salud
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Número de Hermanos</label>
                <p className="text-gray-900 font-medium">{showValue(student.num_siblings)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Colegio de Procedencia</label>
                <p className="text-gray-900 font-medium">{showValue(student.school_name)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Alergias</label>
                <p className="text-gray-900 font-medium">{showValue(student.allergies)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Accidentes Graves</label>
                <p className="text-gray-900 font-medium">{showValue(student.serious_accidents)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;

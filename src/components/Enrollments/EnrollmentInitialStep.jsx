import React, { useState, useEffect } from "react";
import { useToast } from "../ui/Toast";
import { fetchGrades, fetchAvailableVacancies } from "../services/EnrollmentService";

const EnrollmentInitialStep = ({ onContinue, onCancel }) => {
  const toast = useToast();
  const [grades, setGrades] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [availableGrades, setAvailableGrades] = useState([]);
  const [vacancies, setVacancies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setLoading(true);
      const data = await fetchGrades();
      setGrades(data);
    } catch (error) {
      toast.show({
        title: "Error",
        message: "Error al cargar los grados",
        type: "error",
        duration: 3500
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    setSelectedGrade("");
    setVacancies(null);
    
    if (level) {
      const filteredGrades = grades.filter(grade => grade.nivel === level);
      setAvailableGrades(filteredGrades);
    } else {
      setAvailableGrades([]);
    }
  };

  const handleGradeChange = (gradeId) => {
    setSelectedGrade(gradeId);
    setVacancies(null);
  };

  const handleSearch = async () => {
    if (!selectedGrade) {
      toast.show({
        title: "Error",
        message: "Por favor selecciona un grado",
        type: "error",
        duration: 2500
      });
      return;
    }

    try {
      setSearching(true);
      const data = await fetchAvailableVacancies(selectedGrade);
      setVacancies(data);
    } catch (error) {
      toast.show({
        title: "Error",
        message: "Error al obtener las vacantes",
        type: "error",
        duration: 3500
      });
    } finally {
      setSearching(false);
    }
  };

  const handleContinue = () => {
    if (!selectedGrade || !vacancies) {
      toast.show({
        title: "Error",
        message: "Por favor busca las vacantes antes de continuar",
        type: "error",
        duration: 2500
      });
      return;
    }

    if (vacancies.available === 0) {
      toast.show({
        title: "Sin vacantes",
        message: "No hay vacantes disponibles en este grado",
        type: "warning",
        duration: 3500
      });
      return;
    }

    onContinue({
      gradeId: selectedGrade,
      gradeName: vacancies.gradeName,
      level: vacancies.level,
      availableVacancies: vacancies.available
    });
  };

  // Obtener niveles únicos de los grados
  const uniqueLevels = [...new Set(grades.map(grade => grade.nivel))];

  return (
    <div className="w-full h-full bg-white p-8">
      <h2 className="text-3xl font-bold mb-8 text-blue-700 text-center">
        Seleccionar Grado para Matrícula
      </h2>

      <div className="space-y-6">
        {/* Nivel Académico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">
              Nivel Académico
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
              disabled={loading}
            >
              <option value="">Seleccionar nivel...</option>
              {uniqueLevels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Grado */}
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">
              Grado
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
              disabled={!selectedLevel || loading}
            >
              <option value="">Seleccionar grado...</option>
              {availableGrades.map(grade => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón Buscar */}
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            disabled={!selectedGrade || searching}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-12 py-4 rounded-lg shadow font-bold text-xl transition-colors"
          >
            {searching ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {/* Cantidad de Vacantes */}
        {vacancies && (
          <div className="bg-gray-100 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Cantidad de Vacantes
            </h3>
            <div className="text-6xl font-bold text-yellow-600 mb-4">
              {vacancies.available}
            </div>
            <div className="text-lg text-gray-600">
              Capacidad: {vacancies.capacity} | Matriculados: {vacancies.enrolled}
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex justify-center gap-6 pt-8">
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-lg shadow font-bold text-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleContinue}
            disabled={!vacancies || vacancies.available === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg shadow font-bold text-xl transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentInitialStep;

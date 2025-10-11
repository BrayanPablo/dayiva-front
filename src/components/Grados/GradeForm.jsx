import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import GradeService from '../services/GradeService';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Textarea from '../shared/Textarea';

const GradeForm = ({ grade, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nivel: '',
    capacidad: '',
    estado: 'Activo'
  });
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    if (grade) {
      setFormData({
        nombre: grade.nombre || '',
        descripcion: grade.descripcion || '',
        nivel: grade.nivel || '',
        capacidad: grade.capacidad || '',
        estado: grade.estado || 'Activo'
      });
    }
  }, [grade]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.nivel) {
      show({ title: 'Error', message: 'Los campos Nombre y Nivel son obligatorios', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      
      if (grade) {
        await GradeService.updateGrade(grade.id_grado, formData);
        show({ title: 'Éxito', message: 'Grado actualizado correctamente', type: 'success' });
      } else {
        await GradeService.createGrade(formData);
        show({ title: 'Éxito', message: 'Grado creado correctamente', type: 'success' });
      }
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error al guardar grado:', error);
      show({ title: 'Error', message: 'No se pudo guardar el grado', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {grade ? 'Editar Grado' : 'Registrar Nuevo Grado'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Grado"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: 4 años, 5 años, Primer Grado"
              required
            />

            <Select
              label="Nivel"
              name="nivel"
              value={formData.nivel}
              onChange={handleChange}
              placeholder="Seleccione un nivel"
              required
              options={[
                { value: "Inicial", label: "Inicial" },
                { value: "Primaria", label: "Primaria" }
              ]}
            />

            <Input
              label="Capacidad"
              type="number"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleChange}
              placeholder="Número máximo de estudiantes"
              min="1"
            />

            <Select
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              options={[
                { value: "Activo", label: "Activo" },
                { value: "Inactivo", label: "Inactivo" }
              ]}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción adicional del grado"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="medium"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              variant="primary"
              size="medium"
            >
              {grade ? 'Actualizar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeForm;

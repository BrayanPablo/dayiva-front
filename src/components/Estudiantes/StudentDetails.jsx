import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import { updateStudent } from '../services/StudentService';

const StudentDetails = ({ student, onClose, onUpdate }) => {
  console.log('StudentDetails renderizado con estudiante:', student);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    // Datos personales
    code: student?.school_code || '',
    first_name: student?.full_name || '',
    last_name: student?.surnames || '',
    identity_document: student?.identity_document || '',
    birth_date: student?.birth_date || '',
    age: student?.age || '',
    gender: student?.gender || '',
    city: student?.city || '',
    address: student?.address || '',
    phone_number: student?.phone_number || '',
    siblings_number: student?.num_siblings || '',
    allergies: student?.allergies || '',
    serious_accidents: student?.serious_accidents || '',
    previous_school: student?.school_name || '',
    status: student?.status || 'Activo',
    // Datos del padre
    father_dni: student?.father_dni || '',
    father_first_name: student?.father_first_name || '',
    father_last_name: student?.father_last_name || '',
    father_birth_date: student?.father_birth_date || '',
    father_email: student?.father_email || '',
    father_phone: student?.father_phone || '',
    father_address: student?.father_address || '',
    father_civil_status: student?.father_civil_status || '',
    father_profession: student?.father_profession || '',
    father_occupation: student?.father_occupation || '',
    father_sport: student?.father_sport || '',
    father_relationship: student?.father_relationship || 'Padre',
    // Datos de la madre
    mother_dni: student?.mother_dni || '',
    mother_first_name: student?.mother_first_name || '',
    mother_last_name: student?.mother_last_name || '',
    mother_birth_date: student?.mother_birth_date || '',
    mother_email: student?.mother_email || '',
    mother_phone: student?.mother_phone || '',
    mother_address: student?.mother_address || '',
    mother_civil_status: student?.mother_civil_status || '',
    mother_profession: student?.mother_profession || '',
    mother_occupation: student?.mother_occupation || '',
    mother_sport: student?.mother_sport || '',
    mother_relationship: student?.mother_relationship || 'Madre'
  });
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  // Helper para dividir full_name en first/last si faltan
  const splitName = (full) => {
    if (!full) return { first: '', last: '' };
    const parts = String(full).trim().split(/\s+/);
    if (parts.length === 1) return { first: parts[0], last: '' };
    // Toma el último token como apellido y el resto como nombres (heurística simple)
    const last = parts.pop();
    const first = parts.join(' ');
    return { first, last };
  };

  // Actualizar datos del formulario cuando cambie el estudiante, con fallback desde full_name
  useEffect(() => {
    if (student) {
      // Fallback para padre
      let fatherFirst = student?.father_first_name || '';
      let fatherLast = student?.father_last_name || '';
      if (!fatherFirst && !fatherLast && student?.father_full_name) {
        const s = splitName(student.father_full_name);
        fatherFirst = s.first;
        fatherLast = s.last;
      }
      // Fallback para madre
      let motherFirst = student?.mother_first_name || '';
      let motherLast = student?.mother_last_name || '';
      if (!motherFirst && !motherLast && student?.mother_full_name) {
        const s = splitName(student.mother_full_name);
        motherFirst = s.first;
        motherLast = s.last;
      }

      const newFormData = {
        code: student?.school_code || '',
        first_name: student?.full_name || '',
        last_name: student?.surnames || '',
        identity_document: student?.identity_document || '',
        birth_date: student?.birth_date || '',
        age: student?.age || '',
        gender: student?.gender || '',
        city: student?.city || '',
        address: student?.address || '',
        phone_number: student?.phone_number || '',
        siblings_number: student?.num_siblings || '',
        allergies: student?.allergies || '',
        serious_accidents: student?.serious_accidents || '',
        previous_school: student?.school_name || '',
        status: student?.status || 'Activo',
        // Padre (con fallback)
        father_dni: student?.father_dni || '',
        father_first_name: fatherFirst,
        father_last_name: fatherLast,
        father_birth_date: student?.father_birth_date || '',
        father_email: student?.father_email || '',
        father_phone: student?.father_phone || '',
        father_address: student?.father_address || '',
        father_civil_status: student?.father_civil_status || '',
        father_profession: student?.father_profession || '',
        father_occupation: student?.father_occupation || '',
        father_sport: student?.father_sport || '',
        father_relationship: student?.father_relationship || 'Padre',
        // Madre (con fallback)
        mother_dni: student?.mother_dni || '',
        mother_first_name: motherFirst,
        mother_last_name: motherLast,
        mother_birth_date: student?.mother_birth_date || '',
        mother_email: student?.mother_email || '',
        mother_phone: student?.mother_phone || '',
        mother_address: student?.mother_address || '',
        mother_civil_status: student?.mother_civil_status || '',
        mother_profession: student?.mother_profession || '',
        mother_occupation: student?.mother_occupation || '',
        mother_sport: student?.mother_sport || '',
        mother_relationship: student?.mother_relationship || 'Madre'
      };
      setFormData(newFormData);
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearForm = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todos los campos del formulario?')) {
      setFormData({
        code: '',
        first_name: '',
        last_name: '',
        identity_document: '',
        birth_date: '',
        age: '',
        gender: '',
        city: '',
        address: '',
        phone_number: '',
        siblings_number: '',
        allergies: '',
        serious_accidents: '',
        previous_school: '',
        status: 'Activo',
        // Padre
        father_dni: '',
        father_first_name: '',
        father_last_name: '',
        father_birth_date: '',
        father_email: '',
        father_phone: '',
        father_address: '',
        father_civil_status: '',
        father_profession: '',
        father_occupation: '',
        father_sport: '',
        father_relationship: 'Padre',
        // Madre
        mother_dni: '',
        mother_first_name: '',
        mother_last_name: '',
        mother_birth_date: '',
        mother_email: '',
        mother_phone: '',
        mother_address: '',
        mother_civil_status: '',
        mother_profession: '',
        mother_occupation: '',
        mother_sport: '',
        mother_relationship: 'Madre'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataObj = new FormData(e.target);
      const studentData = {
        identity_document: formData.identity_document,
        first_name: formData.first_name,
        last_name: formData.last_name,
        birth_date: formData.birth_date,
        age: formData.age,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        phone_number: formData.phone_number,
        num_siblings: formData.siblings_number,
        allergies: formData.allergies,
        serious_accidents: formData.serious_accidents,
        status: formData.status,
        // Padre
        father_dni: formDataObj.get('father_dni') || '',
        father_first_name: formDataObj.get('father_first_name') || '',
        father_last_name: formDataObj.get('father_last_name') || '',
        father_birth_date: formDataObj.get('father_birth_date') || '',
        father_email: formDataObj.get('father_email') || '',
        father_phone: formDataObj.get('father_phone') || '',
        father_address: formDataObj.get('father_address') || '',
        father_civil_status: formDataObj.get('father_civil_status') || '',
        father_profession: formDataObj.get('father_profession') || '',
        father_occupation: formDataObj.get('father_occupation') || '',
        father_sport: formDataObj.get('father_sport') || '',
        // Madre
        mother_dni: formDataObj.get('mother_dni') || '',
        mother_first_name: formDataObj.get('mother_first_name') || '',
        mother_last_name: formDataObj.get('mother_last_name') || '',
        mother_birth_date: formDataObj.get('mother_birth_date') || '',
        mother_email: formDataObj.get('mother_email') || '',
        mother_phone: formDataObj.get('mother_phone') || '',
        mother_address: formDataObj.get('mother_address') || '',
        mother_civil_status: formDataObj.get('mother_civil_status') || '',
        mother_profession: formDataObj.get('mother_profession') || '',
        mother_occupation: formDataObj.get('mother_occupation') || '',
        mother_sport: formDataObj.get('mother_sport') || ''
      };
      await updateStudent(student.id, studentData);
      show({ title: 'Éxito', message: 'Datos actualizados correctamente', type: 'success' });
      if (onUpdate) onUpdate(studentData);
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
      show({ title: 'Error', message: 'No se pudieron actualizar los datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Datos Personales', icon: '👤' },
    { id: 'family', label: 'Datos Familiares', icon: '👨‍👩‍👧‍👦' },
    { id: 'location', label: 'Ubicación', icon: '📍' },
    { id: 'health', label: 'Salud', icon: '❤️' }
  ];

  const renderPersonalData = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código del Estudiante
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Código único del estudiante"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombres *
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombres completos"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellidos *
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Apellidos completos"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DNI *
          </label>
          <input
            type="text"
            name="identity_document"
            value={formData.identity_document}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Sin puntos ni guiones"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sexo
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderFamilyData = () => (
    <div className="space-y-6">
      {/* Información del Padre */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          👨 Información del Padre
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DNI del Padre
            </label>
            <input
              type="text"
              name="father_dni"
              value={formData.father_dni}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Documento de identidad"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombres
            </label>
            <input
              type="text"
              name="father_first_name"
              value={formData.father_first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombres del padre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellidos
            </label>
            <input
              type="text"
              name="father_last_name"
              value={formData.father_last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Apellidos del padre"
            />
          </div>
          {/* Eliminado: Apellido Materno del Padre para alinear con la BD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="father_birth_date"
              value={formData.father_birth_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parentesco
            </label>
            <select
              name="father_relationship"
              value={formData.father_relationship || 'Padre'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione</option>
              <option value="Padre">Padre</option>
              <option value="Madre">Madre</option>
              <option value="Tutor">Tutor</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="father_email"
              value={formData.father_email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              name="father_phone"
              value={formData.father_phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número de teléfono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="father_address"
              value={formData.father_address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dirección de residencia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado Civil
            </label>
            <select
              name="father_civil_status"
              value={formData.father_civil_status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione</option>
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Viudo">Viudo</option>
              <option value="Conviviente">Conviviente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profesión
            </label>
            <input
              type="text"
              name="father_profession"
              value={formData.father_profession}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Profesión"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ocupación
            </label>
            <input
              type="text"
              name="father_occupation"
              value={formData.father_occupation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cargo que desempeña"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deporte
            </label>
            <input
              type="text"
              name="father_sport"
              value={formData.father_sport}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Deporte que practica"
            />
          </div>
        </div>
      </div>

      {/* Información de la Madre */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
          👩 Información de la Madre
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DNI de la Madre
            </label>
            <input
              type="text"
              name="mother_dni"
              value={formData.mother_dni}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Documento de identidad"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombres
            </label>
            <input
              type="text"
              name="mother_first_name"
              value={formData.mother_first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Nombres de la madre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellidos
            </label>
            <input
              type="text"
              name="mother_last_name"
              value={formData.mother_last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Apellidos de la madre"
            />
          </div>
          {/* Eliminado: Apellido Materno de la Madre para alinear con la BD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="mother_birth_date"
              value={formData.mother_birth_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parentesco
            </label>
            <select
              name="mother_relationship"
              value={formData.mother_relationship || 'Madre'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Seleccione</option>
              <option value="Padre">Padre</option>
              <option value="Madre">Madre</option>
              <option value="Tutor">Tutor</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="mother_email"
              value={formData.mother_email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              name="mother_phone"
              value={formData.mother_phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Número de teléfono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="mother_address"
              value={formData.mother_address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Dirección de residencia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado Civil
            </label>
            <select
              name="mother_civil_status"
              value={formData.mother_civil_status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Seleccione</option>
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Viudo">Viudo</option>
              <option value="Conviviente">Conviviente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profesión
            </label>
            <input
              type="text"
              name="mother_profession"
              value={formData.mother_profession}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Profesión"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ocupación
            </label>
            <input
              type="text"
              name="mother_occupation"
              value={formData.mother_occupation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Cargo que desempeña"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deporte
            </label>
            <input
              type="text"
              name="mother_sport"
              value={formData.mother_sport}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Deporte que practica"
            />
          </div>
        </div>
      </div>

      {/* Información de Tutor (si aplica) */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
          👨‍🏫 Información del Tutor (si aplica)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DNI del Tutor
            </label>
            <input
              type="text"
              name="tutor_dni"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Documento de identidad"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombres Completos
            </label>
            <input
              type="text"
              name="tutor_name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nombres del tutor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              name="tutor_phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Número de teléfono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parentesco
            </label>
            <select
              name="tutor_relationship"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccione</option>
              <option value="Padre">Padre</option>
              <option value="Madre">Madre</option>
              <option value="Tutor">Tutor</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocationData = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ciudad
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ciudad de residencia"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Número de teléfono"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dirección
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Dirección completa de residencia"
        />
      </div>
    </div>
  );

  const renderHealthData = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Hermanos
          </label>
          <input
            type="number"
            name="siblings_number"
            value={formData.siblings_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cantidad de hermanos"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colegio de Procedencia
          </label>
          <input
            type="text"
            name="previous_school"
            value={formData.previous_school}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Último colegio donde estudió"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alergias
        </label>
        <textarea
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describa las alergias conocidas (si las hay)"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accidentes Graves
        </label>
        <textarea
          name="serious_accidents"
          value={formData.serious_accidents}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describa accidentes graves o condiciones médicas importantes"
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalData();
      case 'family':
        return renderFamilyData();
      case 'location':
        return renderLocationData();
      case 'health':
        return renderHealthData();
      default:
        return renderPersonalData();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Editar Estudiante
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {renderTabContent()}

          {/* Botones */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClearForm}
              className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
            >
              🗑️ Limpiar Formulario
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDetails;

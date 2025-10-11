import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudent } from "../services/StudentService";
import Button from "../shared/Button";
import { useToast } from "../ui/Toast";

const StudentRegistrationPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    // Datos Personales
    identity_document: "",
    full_name: "",
    last_name: "", // Apellido paterno (solo para UI)
    middle_name: "", // Apellido materno (solo para UI)
    birth_date: "",
    age: "",
    gender: "",
    status: "Activo",
    
    // Datos Familiares - Padre
    father_dni: "",
    father_first_name: "",
    father_last_name: "",
    father_birth_date: "",
    father_relationship: "Padre",
    father_email: "",
    father_phone: "",
    father_address: "",
    father_civil_status: "",
    father_profession: "",
    father_occupation: "",
    father_sport: "",
    
    // Datos Familiares - Madre
    mother_dni: "",
    mother_first_name: "",
    mother_last_name: "",
    mother_birth_date: "",
    mother_relationship: "Madre",
    mother_email: "",
    mother_phone: "",
    mother_address: "",
    mother_civil_status: "",
    mother_profession: "",
    mother_occupation: "",
    mother_sport: "",
    
    // Datos Familiares - Tutor
    tutor_dni: "",
    tutor_name: "",
    tutor_phone: "",
    tutor_relationship: "Tutor",
    
    // Ubicación
    address: "",
    city: "",
    phone_number: "",
    
    // Colegio de Procedencia
    school_name: "",
    school_code: "",
    grade: "",
    
    // Salud
    num_siblings: "",
    allergies: "",
    serious_accidents: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validación básica de campos obligatorios
    if (!form.full_name || !form.last_name || !form.identity_document) {
      setError("Por favor complete los datos personales obligatorios (Nombres, Apellido Paterno y DNI)");
      return;
    }
    
    // Preparar datos para envío, convirtiendo campos vacíos a null para campos numéricos
    const surnames = `${form.last_name} ${form.middle_name || ''}`.trim();
    const formData = {
      ...form,
      surnames: surnames,
      age: form.age && form.age !== '' ? parseInt(form.age) : null,
      num_siblings: form.num_siblings && form.num_siblings !== '' ? parseInt(form.num_siblings) : null
    };
    
    // Eliminar campos que no se envían a la base de datos
    delete formData.last_name;
    delete formData.middle_name;
    
    setLoading(true);
    
    try {
      await registerStudent(formData);
      setSuccess("Estudiante registrado con éxito");
      toast.show({ 
        title: "Estudiante registrado", 
        message: "Se ha registrado correctamente", 
        type: "success", 
        duration: 3500 
      });
      resetForm();
      // Navegar de vuelta a la lista de estudiantes después de 2 segundos
      setTimeout(() => {
        navigate("/students");
      }, 2000);
    } catch (error) {
      setError("Error al registrar estudiante");
      toast.show({ 
        title: "Error", 
        message: "Error al registrar estudiante", 
        type: "error", 
        duration: 4000 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      // Datos Personales
      identity_document: "",
      full_name: "",
      last_name: "",
      middle_name: "",
      birth_date: "",
      age: "",
      gender: "",
      status: "Activo",
      
      // Datos Familiares - Padre
      father_dni: "",
      father_first_name: "",
      father_last_name: "",
      father_birth_date: "",
      father_relationship: "Padre",
      father_email: "",
      father_phone: "",
      father_address: "",
      father_civil_status: "",
      father_profession: "",
      father_occupation: "",
      father_sport: "",
      
      // Datos Familiares - Madre
      mother_dni: "",
      mother_first_name: "",
      mother_last_name: "",
      mother_birth_date: "",
      mother_relationship: "Madre",
      mother_email: "",
      mother_phone: "",
      mother_address: "",
      mother_civil_status: "",
      mother_profession: "",
      mother_occupation: "",
      mother_sport: "",
      
      // Datos Familiares - Tutor
      tutor_dni: "",
      tutor_name: "",
      tutor_phone: "",
      tutor_relationship: "Tutor",
      
      // Ubicación
      address: "",
      city: "",
      phone_number: "",
      
      // Colegio de Procedencia
      school_name: "",
      school_code: "",
      grade: "",
      
      // Salud
      num_siblings: "",
      allergies: "",
      serious_accidents: "",
    });
    setActiveTab("personal");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-start justify-start pt-8 w-full">
      <div className="w-full flex flex-col gap-4 pt-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 w-full">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/students")}
              className="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
            >
              ← Regresar
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-blue-700">Registro de Estudiante</h2>
              <p className="text-gray-600">Complete la información del estudiante</p>
            </div>
          </div>
        </div>

        {/* Mensajes de error y éxito */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Formulario */}
        <div className="w-full pb-4 flex-1 flex items-start">
          <div className="w-full">
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900">Formulario de Registro</h3>
                </div>
                <div className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Pestañas */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab("personal")}
                  className={`${
                    activeTab === "personal"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  👤 Datos Personales
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("family")}
                  className={`${
                    activeTab === "family"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  👨‍👩‍👧‍👦 Datos Familiares
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("location")}
                  className={`${
                    activeTab === "location"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  📍 Ubicación
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("health")}
                  className={`${
                    activeTab === "health"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  ❤️ Salud
                </button>
              </nav>
            </div>

            {/* Contenido de las pestañas */}
            <div className="min-h-[400px]">
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Estado</label>
                    <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4">
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Sexo</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4">
                      <option value="">Seleccione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Edad</label>
                    <input type="number" name="age" value={form.age} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" min="0" placeholder="Edad" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nombres *</label>
                    <input type="text" name="full_name" value={form.full_name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Nombres del estudiante" required />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Apellido Paterno *</label>
                    <input type="text" name="last_name" value={form.last_name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Apellido paterno" required />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Apellido Materno</label>
                    <input type="text" name="middle_name" value={form.middle_name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Apellido materno" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Documento de Identidad *</label>
                    <input type="text" name="identity_document" value={form.identity_document} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="DNI o cédula" required />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Fecha de Nacimiento</label>
                    <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" />
                  </div>
                  
                  {/* Campos del Colegio de Procedencia */}
                  <div className="md:col-span-3 lg:col-span-3">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      🏫 Colegio de Procedencia
                    </h4>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nombre del Colegio</label>
                    <input type="text" name="school_name" value={form.school_name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Nombre del colegio anterior" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Código del Colegio</label>
                    <input type="text" name="school_code" value={form.school_code} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Código del colegio" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Grado</label>
                    <input type="text" name="grade" value={form.grade} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Grado que cursaba" />
                  </div>
                </div>
              )}

              {activeTab === "family" && (
                <div className="space-y-6">
                  {/* Información del Padre */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                      👨 Información del Padre
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">DNI del Padre</label>
                        <input type="text" name="father_dni" value={form.father_dni} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Documento de identidad" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                        <input type="text" name="father_first_name" value={form.father_first_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombres del padre" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                        <input type="text" name="father_last_name" value={form.father_last_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Apellidos del padre" />
                      </div>
                      {/* Eliminado: Apellido Materno del Padre para alinear con la BD */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                        <input type="date" name="father_birth_date" value={form.father_birth_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" name="father_email" value={form.father_email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="correo@ejemplo.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                        <input type="text" name="father_phone" value={form.father_phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Número de teléfono" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profesión</label>
                        <input type="text" name="father_profession" value={form.father_profession} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Profesión" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ocupación</label>
                        <input type="text" name="father_occupation" value={form.father_occupation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Cargo que desempeña" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deporte</label>
                        <input type="text" name="father_sport" value={form.father_sport} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Deporte que practica" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado Civil</label>
                        <select name="father_civil_status" value={form.father_civil_status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Seleccione</option>
                          <option value="Soltero">Soltero</option>
                          <option value="Casado">Casado</option>
                          <option value="Divorciado">Divorciado</option>
                          <option value="Viudo">Viudo</option>
                          <option value="Conviviente">Conviviente</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                        <input type="text" name="father_address" value={form.father_address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Dirección de residencia" />
                      </div>
                    </div>
                  </div>

                  {/* Información de la Madre */}
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
                      👩 Información de la Madre
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">DNI de la Madre</label>
                        <input type="text" name="mother_dni" value={form.mother_dni} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Documento de identidad" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                        <input type="text" name="mother_first_name" value={form.mother_first_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Nombres de la madre" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                        <input type="text" name="mother_last_name" value={form.mother_last_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Apellidos de la madre" />
                      </div>
                      {/* Eliminado: Apellido Materno de la Madre para alinear con la BD */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                        <input type="date" name="mother_birth_date" value={form.mother_birth_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" name="mother_email" value={form.mother_email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="correo@ejemplo.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                        <input type="text" name="mother_phone" value={form.mother_phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Número de teléfono" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profesión</label>
                        <input type="text" name="mother_profession" value={form.mother_profession} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Profesión" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ocupación</label>
                        <input type="text" name="mother_occupation" value={form.mother_occupation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Cargo que desempeña" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deporte</label>
                        <input type="text" name="mother_sport" value={form.mother_sport} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Deporte que practica" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado Civil</label>
                        <select name="mother_civil_status" value={form.mother_civil_status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500">
                          <option value="">Seleccione</option>
                          <option value="Soltero">Soltero</option>
                          <option value="Casado">Casado</option>
                          <option value="Divorciado">Divorciado</option>
                          <option value="Viudo">Viudo</option>
                          <option value="Conviviente">Conviviente</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                        <input type="text" name="mother_address" value={form.mother_address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Dirección de residencia" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "location" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Ciudad</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Ciudad de residencia" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
                    <input type="text" name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Número de teléfono" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">Dirección</label>
                    <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Dirección completa" />
                  </div>
                </div>
              )}

              {activeTab === "health" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">N° Hermanos</label>
                    <input type="number" name="num_siblings" value={form.num_siblings} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" min="0" placeholder="Número de hermanos" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Alergias</label>
                    <input type="text" name="allergies" value={form.allergies} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Alergias conocidas" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Accidentes Graves</label>
                    <input type="text" name="serious_accidents" value={form.serious_accidents} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Accidentes graves" />
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-between mt-6">
              <div className="flex space-x-2">
                {activeTab !== "personal" && (
                  <Button type="button" onClick={() => {
                    const tabs = ["personal", "family", "location", "health"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1]);
                    }
                  }} className="bg-gray-300 text-gray-800">
                    ← Anterior
                  </Button>
                )}
                {activeTab !== "health" && (
                  <Button type="button" onClick={() => {
                    const tabs = ["personal", "family", "location", "health"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    }
                  }} className="bg-blue-500 text-white">
                    Siguiente →
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button type="button" onClick={() => navigate("/students")} className="bg-gray-300 text-gray-800">
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 text-white">
                  {loading ? "Guardando..." : "Guardar Registro"}
                </Button>
              </div>
            </div>
          </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationPage;

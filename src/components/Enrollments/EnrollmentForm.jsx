import React, { useState, useEffect, useMemo } from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import { registerEnrollment, fetchGrades, downloadEnrollmentReceipt } from "../services/EnrollmentService";
import { getStudentById } from "../services/StudentService";
import { createPayment } from "../services/PaymentService";
import EnrollmentInitialStep from "./EnrollmentInitialStep";
import StudentSearchModal from "../Estudiantes/StudentSearchModal";
// import GuardianSearchModal from "./GuardianSearchModal"; // eliminado, ya no se usa
import { useToast } from "../ui/Toast";

// Modal simple reutilizable
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button className="text-gray-500 hover:text-gray-700 text-2xl" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const EnrollmentForm = ({ onSuccess }) => {
  const toast = useToast();
  const [showInitialStep, setShowInitialStep] = useState(true);
  const [selectedGradeInfo, setSelectedGradeInfo] = useState(null);
  const [situation, setSituation] = useState("");
  const [student, setStudent] = useState(null);
  const [guardian, setGuardian] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [relationship, setRelationship] = useState("Madre");
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showGuardianModal, setShowGuardianModal] = useState(false);
  const [form, setForm] = useState({
    grade_id: "",
    enrollment_date: "",
    academic_year: new Date().getFullYear().toString(),
    status: "Activo",
    payment_status: "Pendiente",
    observations: "",
    previous_school: "",
    is_repeating: "NO",
    // Pago de matrícula (UI)
    tuition_amount: "",
    discount_percent: "",
    payment_amount: "",
    payment_date: "",
    payment_method: "Efectivo"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null);

  useEffect(() => {
    // Generar código de matrícula automático
    const generateEnrollmentCode = () => {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `MAT-${year}-${random}`;
    };
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    
    setForm(prev => ({ ...prev, enrollment_code: generateEnrollmentCode(), enrollment_date: todayStr, payment_date: todayStr }));
  }, []);

  const handleInitialStepContinue = (gradeInfo) => {
    setSelectedGradeInfo(gradeInfo);
    setForm(prev => ({ ...prev, grade_id: gradeInfo.gradeId }));
    setShowInitialStep(false);
  };

  const handleInitialStepCancel = () => {
    if (onSuccess) onSuccess();
  };

  const handleSituationChange = (e) => {
    setSituation(e.target.value);
    setStudent(null);
    setGuardian(null);
    setStudentDetails(null);
    setRelationship("Madre");
    setError("");
    setForm(prev => ({ ...prev, previous_school: "", tuition_amount: e.target.value === "Promovido" ? "200" : prev.tuition_amount }));
  };

  const handleSelectStudent = async (selectedStudent) => {
    setError("");
    try {
      const details = await getStudentById(selectedStudent.id);
      setStudent(details);
      setStudentDetails(details);
      // Por defecto autocompletar madre
      const mother = {
        id: undefined,
        identity_document: details.mother_dni || "",
        full_name: details.mother_full_name || "",
        surname: details.mother_surname || "",
        birth_date: details.mother_birth_date || null,
        phone: details.mother_phone || "",
        relationship: details.mother_relationship || "Madre",
      };
      setGuardian(mother);
      setRelationship("Madre");
    } catch (err) {
      setStudent(selectedStudent);
      setStudentDetails(null);
    }
  };

  const handleSelectGuardian = (selectedGuardian) => {
    setGuardian(selectedGuardian);
    setError("");
  };

  const handleClearStudent = () => {
    setStudent(null);
    setStudentDetails(null);
    setGuardian(null);
  };

  const handleClearGuardian = () => {
    setGuardian(null);
  };

  const handleRelationshipChange = (e) => {
    const value = e.target.value;
    setRelationship(value);
    if (!studentDetails) return;
    if (value === "Madre") {
      const mother = {
        id: undefined,
        identity_document: studentDetails.mother_dni || "",
        full_name: studentDetails.mother_full_name || "",
        surname: studentDetails.mother_surname || "",
        birth_date: studentDetails.mother_birth_date || null,
        phone: studentDetails.mother_phone || "",
        relationship: studentDetails.mother_relationship || "Madre",
      };
      setGuardian(mother);
    } else if (value === "Padre") {
      const father = {
        id: undefined,
        identity_document: studentDetails.father_dni || "",
        full_name: studentDetails.father_full_name || "",
        surname: studentDetails.father_surname || "",
        birth_date: studentDetails.father_birth_date || null,
        phone: studentDetails.father_phone || "",
        relationship: studentDetails.father_relationship || "Padre",
      };
      setGuardian(father);
    } else {
      // Tutor u Otro: no autocompletar
      setGuardian(null);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!student || !student.id) {
      setError("Debes seleccionar un alumno");
      return;
    }
    if (!guardian || !(guardian.identity_document || guardian.full_name)) {
      setError("Faltan datos del apoderado (DNI o nombre)");
      return;
    }
    if (!form.grade_id || !form.enrollment_date || !form.academic_year) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    
    setLoading(true);
    try {
      const res = await registerEnrollment({
        student_id: student.id,
        grade_id: form.grade_id,
        enrollment_date: form.enrollment_date,
        academic_year: form.academic_year,
        status: form.status,
        payment_status: form.payment_status,
        observations: form.observations === "SI"
      });

      // Registrar pago de matrícula si hay monto
      const amountNum = parseFloat(form.tuition_amount || 0);
      if (res?.id && amountNum > 0) {
        const discPct = parseFloat(form.discount_percent || 0);
        const payAmt = parseFloat(form.payment_amount || 0);
        await createPayment({
          student_id: student.id,
          enrollment_id: res.id,
          type: 'Matricula',
          amount: amountNum,
          discount_percent: discPct,
          paid_amount: payAmt,
          method: form.payment_method,
          payment_date: form.payment_date,
        });
      }

      setEnrollmentId(res.id);
      setSuccess("Matrícula registrada correctamente");
      toast.show({ 
        title: "Matrícula registrada", 
        message: "Se registró correctamente", 
        type: "success", 
        duration: 3500 
      });
    } catch (err) {
      setError("Error al registrar matrícula");
      toast.show({ 
        title: "Error", 
        message: "Error al registrar matrícula", 
        type: "error", 
        duration: 4000 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    if (onSuccess) onSuccess();
  };

  const handleDownloadReceipt = async () => {
    if (!enrollmentId) return;
    try {
      await downloadEnrollmentReceipt(enrollmentId);
      toast.show({ 
        title: "Comprobante descargado", 
        message: "El PDF se ha descargado correctamente", 
        type: "success", 
        duration: 3000 
      });
    } catch (err) {
      toast.show({ 
        title: "Error", 
        message: "Error al descargar comprobante", 
        type: "error", 
        duration: 3000 
      });
    }
  };

  if (showInitialStep) {
    return (
      <EnrollmentInitialStep
        onContinue={handleInitialStepContinue}
        onCancel={handleInitialStepCancel}
      />
    );
  }

  return (
    <div className="w-full h-full bg-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-700">Detalle Matrícula</h2>
        <button
          type="button"
          onClick={() => setShowInitialStep(true)}
          className="text-blue-600 hover:text-blue-800 text-lg font-semibold"
        >
          ← Cambiar grado
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Situación del Alumno */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Situación Alumno</h3>
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => handleSituationChange({ target: { value: "Nuevo" } })}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors text-lg ${
                situation === "Nuevo" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Nuevo
            </button>
            <button
              type="button"
              onClick={() => handleSituationChange({ target: { value: "Promovido" } })}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors text-lg ${
                situation === "Promovido" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Promovido
            </button>
          </div>
          <div className="mt-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Código Matrícula Autogenerado
            </label>
            <input
              type="text"
              value={form.enrollment_code || ''}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
            />
          </div>
        </div>

        {/* Datos Académicos */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Datos Académicos</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {situation === "Nuevo" && (
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Instituto de Procedencia
                </label>
                <input
                  type="text"
                  name="previous_school"
                  value={form.previous_school}
                  onChange={handleChange}
                  placeholder="ninguno"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
            )}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Es Repitente
              </label>
              <select
                name="is_repeating"
                value={form.is_repeating}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                <option value="NO">NO</option>
                <option value="SI">SI</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Nivel Académico
              </label>
              <input
                type="text"
                value={selectedGradeInfo?.level || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Grado
              </label>
              <input
                type="text"
                value={selectedGradeInfo?.gradeName || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
            </div>
          </div>
              </div>

        {/* Datos del Alumno */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Datos del Alumno</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Documento Identidad
              </label>
              <input
                type="text"
                value={student?.identity_document || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
                </div>
                <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Nombres
              </label>
              <input
                type="text"
                value={student?.full_name || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
                </div>
                <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Apellidos
              </label>
              <input
                type="text"
                value={student?.surnames || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowStudentModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={handleClearStudent}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg"
              >
                Limpiar
              </button>
                </div>
                <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Fecha Nacimiento
              </label>
              <input
                type="text"
                value={student?.birth_date ? new Date(student.birth_date).toLocaleDateString() : ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
                </div>
                <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Sexo
              </label>
              <input
                type="text"
                value={student?.gender || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
                </div>
                <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                value={student?.city || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
                </div>
                <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={student?.address || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
              </div>
          </div>
        </div>

        {/* Datos del Apoderado */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Datos del Apoderado</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Tipo Relación
              </label>
              <select value={relationship} onChange={handleRelationshipChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg">
                <option value="Madre">Madre</option>
                <option value="Padre">Padre</option>
                <option value="Tutor">Tutor</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Documento Identidad
              </label>
              <input
                type="text"
                value={guardian?.identity_document || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Nombres
              </label>
              <input
                type="text"
                value={guardian?.full_name || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Apellidos
              </label>
              <input
                type="text"
                value={guardian?.surname || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="text"
                value={guardian?.phone || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
              </div>
          </div>
        </div>

        {/* Campos adicionales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Fecha de matrícula *
            </label>
            <input
              type="date"
              name="enrollment_date"
              value={form.enrollment_date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Año académico *
            </label>
            <input
              type="text"
              name="academic_year"
              value={form.academic_year}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              required
            />
          </div>
        </div>

        {error && <div className="text-red-600 p-4 bg-red-50 rounded-lg text-lg">{error}</div>}
        {success && <div className="text-green-600 p-4 bg-green-50 rounded-lg text-lg">{success}</div>}

        {/* Pago de Matrícula (UI) */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Pago de Matrícula</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Monto Matrícula</label>
              <input
                type="number"
                name="tuition_amount"
                value={form.tuition_amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Descuento (%)</label>
              <input
                type="number"
                name="discount_percent"
                value={form.discount_percent}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Monto a Pagar</label>
              <input
                type="number"
                name="payment_amount"
                value={form.payment_amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Fecha de pago</label>
              <input
                type="date"
                name="payment_date"
                value={form.payment_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
        </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Método</label>
              <select
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Yape">Yape</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Otro">Otro</option>
          </select>
        </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Total (automático)</label>
              <input
                type="text"
                readOnly
                value={(function(){
                  const amount = parseFloat(form.tuition_amount || 0);
                  const disc = parseFloat(form.discount_percent || 0);
                  const total = amount - (amount * disc / 100);
                  return isNaN(total) ? '' : total.toFixed(2);
                })()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-lg"
              />
            </div>
        </div>
        </div>

        {/* Botones finales */}
        <div className="flex justify-center gap-8 pt-8">
          {enrollmentId ? (
            <>
              <Button
                type="button"
                onClick={handleDownloadReceipt}
                variant="primary"
                size="xl"
                className="px-8"
              >
                📄 Descargar Comprobante
              </Button>
              <Button
                type="button"
                onClick={handleExit}
                variant="secondary"
                size="xl"
                className="px-12"
              >
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                onClick={handleExit}
                variant="secondary"
                size="xl"
                className="px-12"
              >
                Salir
              </Button>
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="success"
                size="xl"
                className="px-12"
              >
                {loading ? "Registrando..." : "Registrar Matrícula"}
              </Button>
            </>
          )}
        </div>
      </form>

      {/* Modales */}
      <StudentSearchModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        onSelectStudent={handleSelectStudent}
        title="Buscar Estudiante"
      />
      {/* Eliminado modal de apoderado */}
    </div>
  );
};

export default EnrollmentForm;

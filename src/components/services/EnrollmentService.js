import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';

const API_URL = "/api/enrollments";

// Obtener todas las matrículas
export async function fetchEnrollments() {
  const res = await apiGet(API_URL);
  if (!res.ok) throw new Error("Error al obtener matrículas");
  return res.json();
}

// Obtener matrícula por ID
export async function fetchEnrollmentById(id) {
  const res = await apiGet(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener matrícula");
  return res.json();
}

// Obtener matrícula completa (para ficha)
export async function fetchEnrollmentFullById(id) {
  const res = await apiGet(`${API_URL}/${id}/full`);
  if (!res.ok) throw new Error("Error al obtener matrícula completa");
  return res.json();
}

// Registrar matrícula
export async function registerEnrollment(data) {
  const res = await apiPost(API_URL, data);
  if (!res.ok) throw new Error("Error al registrar matrícula");
  return res.json();
}

// Actualizar matrícula
export async function updateEnrollment(id, data) {
  const res = await apiPut(`${API_URL}/${id}`, data);
  if (!res.ok) throw new Error("Error al actualizar matrícula");
  return res.json();
}

// Eliminar matrícula
export async function deleteEnrollment(id) {
  const res = await apiDelete(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al eliminar matrícula");
  return res.json();
}

// Obtener grados
export async function fetchGrades() {
  const res = await apiGet("/api/enrollments/grades");
  if (!res.ok) throw new Error("Error al obtener grados");
  return res.json();
}

// Buscar estudiante por DNI
export async function fetchStudentByDni(dni) {
  const res = await apiGet(`/api/enrollments/student?dni=${dni}`);
  if (!res.ok) throw new Error("Alumno no encontrado");
  return res.json();
}

// Obtener vacantes disponibles por grado
export async function fetchAvailableVacancies(gradeId) {
  const res = await apiGet(`/api/enrollments/vacancies/${gradeId}`);
  if (!res.ok) throw new Error("Error al obtener vacantes");
  return res.json();
}

// Descargar comprobante de matrícula
export async function downloadEnrollmentReceipt(enrollmentId) {
  const res = await apiGet(`/api/enrollments/${enrollmentId}/receipt`);
  if (!res.ok) throw new Error("Error al generar comprobante");
  
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comprobante_matricula_${enrollmentId}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

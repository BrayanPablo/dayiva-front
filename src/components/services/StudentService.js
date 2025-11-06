import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';

const API_URL = "/api/students";

export async function fetchStudents() {
	const res = await apiGet(API_URL);
	if (!res.ok) throw new Error("Error al obtener estudiantes");
	return res.json();
}

export async function fetchEnrolledStudentsCurrentYear() {
  const res = await apiGet(`${API_URL}/enrolled/current`);
  if (!res.ok) throw new Error('Error al obtener estudiantes matriculados');
  return res.json();
}

export async function fetchAllStudentsWithGradeCurrentYear() {
  const res = await apiGet(`${API_URL}/with-grade/current`);
  if (!res.ok) throw new Error('Error al obtener estudiantes con grado');
  return res.json();
}

export async function registerStudent(data) {
	const res = await apiPost(API_URL, data);
	if (!res.ok) throw new Error("Error al registrar estudiante");
	return res.json();
}

export async function getStudentById(id) {
	const res = await apiGet(`${API_URL}/${id}`);
	if (!res.ok) throw new Error("Error al obtener estudiante");
	return res.json();
}

export async function updateStudent(id, data) {
	const res = await apiPut(`${API_URL}/${id}`, data);
	if (!res.ok) throw new Error("Error al actualizar estudiante");
	return res.json();
}

export async function deleteStudent(id) {
	const res = await apiDelete(`${API_URL}/${id}`);
	if (!res.ok) throw new Error("Error al eliminar estudiante");
	return res.json();
}

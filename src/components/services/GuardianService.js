// src/components/services/GuardianService.js
import { apiGet, apiPost } from '../../utils/api';

const API_URL = "/api/guardians";

export async function fetchGuardians() {
  const res = await apiGet(API_URL);
  if (!res.ok) throw new Error("Error al obtener apoderados");
  return res.json();
}

export async function registerGuardian(data) {
  const res = await apiPost(API_URL + "/register", data);
  if (!res.ok) throw new Error("Error al registrar apoderado");
  return res.json();
}

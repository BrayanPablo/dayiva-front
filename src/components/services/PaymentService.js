import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';

const API_URL = "/api/payments";

export async function createPayment(data) {
  const res = await apiPost(API_URL, data);
  if (!res.ok) throw new Error("Error al registrar pago");
  return res.json();
}

export async function getAllPayments() {
  const res = await apiGet(API_URL);
  if (!res.ok) throw new Error('Error al listar pagos');
  return res.json();
}

export async function getPaymentById(id) {
  const res = await apiGet(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener pago');
  return res.json();
}

export async function updatePayment(id, data) {
  const res = await apiPut(`${API_URL}/${id}`, data);
  if (!res.ok) throw new Error('Error al actualizar pago');
  return res.json();
}

export async function deletePayment(id) {
  const res = await apiDelete(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al eliminar pago');
  return res.json();
}



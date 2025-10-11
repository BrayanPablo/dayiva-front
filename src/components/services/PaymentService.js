import { apiPost } from '../../utils/api';

const API_URL = "/api/payments";

export async function createPayment(data) {
  const res = await apiPost(API_URL, data);
  if (!res.ok) throw new Error("Error al registrar pago");
  return res.json();
}



// SIMULADO por ahora. Cambia esto por llamadas reales a tu API cuando la tengas.
export async function loginRequest(username, password) {
  // Llamada real al backend para login (usa VITE_API_URL si está definida)
  const base = import.meta?.env?.VITE_API_URL || 'https://dayiva-back-production.up.railway.app';
  const url = base ? `${base}/api/auth/login` : "/api/auth/login";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let message = "Credenciales inválidas";
    try {
      const errorData = await response.json();
      if (errorData && (errorData.message || errorData.error)) {
        message = errorData.message || errorData.error;
      }
    } catch (_) {
      // ignora error de parseo
    }
    throw new Error(message);
  }

  const data = await response.json();
  // Normaliza el rol a minúsculas por si acaso
  return {
    token: data.token,
    user: { ...data.user, role: data.user.role?.toLowerCase() },
  };
}

// Función 'meRequest' eliminada por ahora

export async function loginRequest(username, password) {
  const base = import.meta?.env?.VITE_API_URL;
  if (!base) {
    throw new Error('VITE_API_URL no está configurada. Configura la variable de entorno en Vercel.');
  }
  const url = `${base}/api/auth/login`;
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

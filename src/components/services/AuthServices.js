// SIMULADO por ahora. Cambia esto por llamadas reales a tu API cuando la tengas.
export async function loginRequest(username, password) {
  // Llamada real al backend para login
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas");
  }

  const data = await response.json();
  // Normaliza el rol a minúsculas por si acaso
  return {
    token: data.token,
    user: { ...data.user, role: data.user.role?.toLowerCase() },
  };
}

// Función 'meRequest' eliminada por ahora

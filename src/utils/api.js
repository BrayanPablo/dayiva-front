// Utilidad para hacer peticiones API con autenticación automática
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  // Si el token es inválido o expiró, redirigir al login
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  }
  
  return response;
};

// Función helper para GET requests
export const apiGet = (url, options = {}) => {
  return apiRequest(url, { method: 'GET', ...options });
};

// Función helper para POST requests
export const apiPost = (url, data, options = {}) => {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

// Función helper para PUT requests
export const apiPut = (url, data, options = {}) => {
  return apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

// Función helper para DELETE requests
export const apiDelete = (url, options = {}) => {
  return apiRequest(url, { method: 'DELETE', ...options });
};

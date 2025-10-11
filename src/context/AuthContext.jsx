import { createContext, useContext, useState } from "react";
import { loginRequest } from "../components/services/AuthServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("auth");
    return saved ? JSON.parse(saved) : { isAuthenticated: false, user: null, role: null };
  });

  const login = async ({ username, password }) => {
    try {
      const { token, user } = await loginRequest(username, password);
      localStorage.setItem("token", token);
      // Normaliza el rol a minúsculas, aunque venga en mayúsculas del backend
      const normalizedRole = user?.role ? user.role.toLowerCase() : null;
      const next = { isAuthenticated: true, user: { ...user, role: normalizedRole }, role: normalizedRole };
      setAuth(next);
      localStorage.setItem("auth", JSON.stringify(next));
    } catch (error) {
      // Propaga el error para que el formulario lo capture y no navegue
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    setAuth({ isAuthenticated: false, user: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

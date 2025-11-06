import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Button from "../shared/Button";
import Input from "../shared/Input";


export default function LoginForm() {
  const [username, setUsername] = useState(""); // Cambié 'email' a 'username'
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // login viene de tu contexto
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      // Usar el método login del contexto para actualizar el estado global y el rol
      await login({ username, password });
      // Simular pantalla de carga corta
      await new Promise((r) => setTimeout(r, 800));
      navigate("/welcome");
    } catch (err) {
      setError(err?.message || "Credenciales inválidas o cuenta inactiva.");
    }
    finally { setLoading(false); }
  };


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con imagen de la fachada */}
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/fachada.jpg)',
          filter: 'brightness(0.7) contrast(1.1)'
        }}
      ></div>
      
      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 -z-10 bg-black/30"></div>
      
      {/* Elementos decorativos sutiles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Contenedor */}
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 animate-fade-in">
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="mx-auto mb-4" />
          <h2 className="text-3xl font-semibold mb-1">SIS DAYIVA SCHOOL</h2>
          <p className="text-xl font-medium mb-6"></p>

          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su nombre de usuario"
              required
            />

            <div className="relative mb-4">
              <Input
                type={show ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-3 text-gray-500 transition-transform hover:scale-110"
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {show ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <Button 
              type="submit" 
              variant="primary" 
              size="large"
              className="w-full transition-transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
            </Button>
          </form>
        </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full border-4 border-base-200 border-t-primary animate-spin"></div>
              <div>
                <p className="font-semibold">Iniciando sesión...</p>
                <p className="text-sm opacity-70">Cargando sistema</p>
              </div>
            </div>
            <div className="relative h-2 bg-base-200 rounded">
              <div className="absolute inset-0 overflow-hidden rounded">
                <div className="h-full w-1/3 bg-primary/70 animate-progress-indeterminate"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

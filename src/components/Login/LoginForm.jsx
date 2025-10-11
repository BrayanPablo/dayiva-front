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
  const { login } = useAuth(); // login viene de tu contexto
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Usar el método login del contexto para actualizar el estado global y el rol
      await login({ username, password });
      // Solo navegar si el login fue exitoso (no lanza error)
      navigate("/welcome");
    } catch (err) {
      setError("Credenciales inválidas o cuenta inactiva.");
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-yellow-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="mx-auto mb-4" />
          <h2 className="text-3xl font-semibold mb-1">SIS DAYIVA SCHOOL</h2>
          <p className="text-xl font-medium mb-6">DAYIVA SCHOOL</p>

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
                className="absolute right-3 top-3 text-gray-500"
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
              className="w-full"
            >
              Ingresar al Sistema
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

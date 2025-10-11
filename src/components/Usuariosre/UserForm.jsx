import React, { useState } from "react";
import Button from "../ui/Button"; // ya lo tienes

const UserForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin");
    const [status, setStatus] = useState("active");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) =>   {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!username || !password || !role || !firstName || !lastName) {
            setError("Todos los campos son obligatorios");
            return;
        }

        setLoading(true);
        const user = { username, password, role, status, first_name: firstName, last_name: lastName };

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                setSuccess("Usuario creado con éxito");
                setUsername("");
                setPassword("");
                setRole("admin");
                setStatus("active");
                setFirstName("");
                setLastName("");
            } else {
                const data = await response.json();
                setError(data.message || "Error al crear el usuario");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4"
        >
            {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
            {success && <div className="text-green-600 text-sm font-medium">{success}</div>}

            <div className="space-y-1">
                <label className="block text-gray-700 font-semibold">Nombre</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-1">
                <label className="block text-gray-700 font-semibold">Apellido</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-1">
                <label className="block text-gray-700 font-semibold">Nombre de usuario</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-1">
                <label className="block text-gray-700 font-semibold">Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-1">
                <label className="block text-gray-700 font-semibold">Rol</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="admin">Admin</option>
                    <option value="teacher">Docente</option>
                    <option value="parent">Padre</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="block text-gray-700 font-semibold">Estado</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={loading}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                </select>
            </div>

            <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Creando..." : "Crear usuario"}
                </Button>
            </div>
        </form>
    );
};

export default UserForm;

import React, { useState, useEffect } from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import Select from "../shared/Select";
import { apiPost, apiPut } from "../../utils/api";
import { useToast } from "../ui/Toast";

const UserForm = ({ onSuccess, user, isEdit }) => {
    const toast = useToast();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin");
    const [status, setStatus] = useState("active");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isEdit && user) {
            setUsername(user.username || "");
            setPassword(user.password || "");
            setRole(user.role || "admin");
            setStatus(user.status || "active");
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
        }
    }, [isEdit, user]);

    const handleSubmit = async (e) =>   {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!username || !password || !role || !firstName || !lastName) {
            setError("Todos los campos son obligatorios");
            return;
        }

        setLoading(true);
        const userData = { username, password, role, status, first_name: firstName, last_name: lastName };

        try {
            let response;
            if (isEdit && user) {
                response = await apiPut(`/api/users/${user.id}`, userData);
            } else {
                response = await apiPost("/api/auth/register", userData);
            }

            if (response.ok) {
                setSuccess(isEdit ? "Usuario editado con éxito" : "Usuario creado con éxito");
                toast.show({
                    title: isEdit ? "Usuario modificado" : "Usuario creado",
                    message: isEdit ? "El usuario se ha modificado correctamente" : "El usuario se ha creado correctamente",
                    type: "success",
                    duration: 3500
                });
                setUsername("");
                setPassword("");
                setRole("admin");
                setStatus("active");
                setFirstName("");
                setLastName("");
                if (onSuccess) onSuccess();
            } else {
                const data = await response.json();
                const msg = data.message || (isEdit ? "Error al editar el usuario" : "Error al crear el usuario");
                setError(msg);
                toast.show({ title: "Error", message: msg, type: "error", duration: 4000 });
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
            toast.show({ title: "Error", message: "Error de conexión con el servidor", type: "error", duration: 4000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 space-y-5 border-2 border-yellow-400"
        >
            {error && <div className="text-red-600 text-sm font-medium mb-2">{error}</div>}
            {success && <div className="text-green-600 text-sm font-medium mb-2">{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                    label="Nombre"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                    placeholder="Ingrese nombres"
                    required
                />

                <Input
                    label="Apellido"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                    placeholder="Ingrese apellidos"
                    required
                />

                <Input
                    label="Nombre de usuario"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading || isEdit}
                    placeholder="Ingrese nombre de usuario"
                    required
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            placeholder="Ingrese la contraseña"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-11"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <Select
                        label="Rol"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={loading}
                        options={[
                            { value: "admin", label: "Admin" },
                            { value: "teacher", label: "Docente" },
                            { value: "parent", label: "Padre" }
                        ]}
                    />
                </div>

                <div className="md:col-span-2">
                    <Select
                        label="Estado"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={loading}
                        options={[
                            { value: "active", label: "Activo" },
                            { value: "inactive", label: "Inactivo" }
                        ]}
                    />
                </div>
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={loading}
                    loading={loading}
                    variant="primary"
                    size="large"
                    className="w-full"
                >
                    {isEdit ? "Guardar cambios" : "Crear usuario"}
                </Button>
            </div>
        </form>
    );
};

export default UserForm;

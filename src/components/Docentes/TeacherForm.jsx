import React, { useState } from "react";
import { useToast } from "../ui/Toast";
import Button from "../shared/Button";
import Input from "../shared/Input";
import Select from "../shared/Select";

const TeacherForm = ({ onSuccess, teacher, isEdit }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    document_id: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "male",
    city: "",
    address: "",
    email: "",
    phone_number: "",
    status: "active"
  });
  // Inicializar datos si es edición
  React.useEffect(() => {
    if (isEdit && teacher) {
      setForm({
        document_id: teacher.document_id || "",
        first_name: teacher.first_name || "",
        last_name: teacher.last_name || "",
        birth_date: teacher.birth_date || "",
        gender: teacher.gender || "male",
        city: teacher.city || "",
        address: teacher.address || "",
        email: teacher.email || "",
        phone_number: teacher.phone_number || "",
        status: teacher.status || "active"
      });
    }
  }, [isEdit, teacher]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      let res;
      if (isEdit && teacher) {
        res = await fetch(`/api/teachers/${teacher.teacher_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch("/api/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      }
      if (!res.ok) throw new Error(isEdit ? "Error al editar docente" : "Error al registrar docente");
      setSuccess(isEdit ? "Docente editado" : "Docente registrado");
      toast.show({
        title: isEdit ? "Docente modificado" : "Docente registrado",
        message: isEdit ? "El docente se ha modificado correctamente" : "El docente se ha registrado correctamente",
        type: "success",
        duration: 3500
      });
      setForm({
        document_id: "",
        first_name: "",
        last_name: "",
        birth_date: "",
        gender: "male",
        city: "",
        address: "",
        email: "",
        phone_number: "",
        status: "active"
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
      toast.show({ title: "Error", message: err.message, type: "error", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-base-100 shadow rounded-box p-6 space-y-4">
      {error && <div role="alert" className="alert alert-error text-sm">{error}</div>}
      {success && <div role="alert" className="alert alert-success text-sm">{success}</div>}
      
      <Input
        label="Documento"
        name="document_id"
        value={form.document_id}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Nombres"
        name="first_name"
        value={form.first_name}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Apellidos"
        name="last_name"
        value={form.last_name}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Fecha de nacimiento"
        type="date"
        name="birth_date"
        value={form.birth_date}
        onChange={handleChange}
        required
      />
      
      <Select
        label="Género"
        name="gender"
        value={form.gender}
        onChange={handleChange}
        required
        options={[
          { value: "male", label: "Masculino" },
          { value: "female", label: "Femenino" },
          { value: "other", label: "Otro" }
        ]}
      />
      
      <Input
        label="Ciudad"
        name="city"
        value={form.city}
        onChange={handleChange}
      />
      
      <Input
        label="Dirección"
        name="address"
        value={form.address}
        onChange={handleChange}
      />
      
      <Input
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Teléfono"
        name="phone_number"
        value={form.phone_number}
        onChange={handleChange}
      />
      
      <Select
        label="Estado"
        name="status"
        value={form.status}
        onChange={handleChange}
        options={[
          { value: "active", label: "Activo" },
          { value: "inactive", label: "Inactivo" }
        ]}
      />
      
      <Button 
        type="submit" 
        disabled={loading}
        loading={loading}
        variant="primary"
        size="large"
        className="w-full"
      >
        {isEdit ? "Actualizar Docente" : "Registrar Docente"}
      </Button>
    </form>
  );
};

export default TeacherForm;

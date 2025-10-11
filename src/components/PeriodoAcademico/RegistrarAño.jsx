import React, { useState, useEffect } from "react";
import { useToast } from "../ui/Toast";

const RegistrarAño = ({ onClose, onSave, yearItem, isEdit }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    year: "",
    start_date: "",
    end_date: "",
    status: "Planificado",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && yearItem) {
      setForm({
        year: String(yearItem.year ?? ""),
        start_date: (yearItem.start_date || "").slice(0, 10),
        end_date: (yearItem.end_date || "").slice(0, 10),
        status: yearItem.status || "Planificado",
        description: yearItem.description || "",
      });
    }
  }, [isEdit, yearItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.year || !form.start_date || !form.end_date) {
      setError("Todos los campos con * son obligatorios");
      return;
    }
    if (new Date(form.start_date) > new Date(form.end_date)) {
      setError("La fecha de inicio no puede ser posterior a la fecha de fin");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        id: yearItem?.id ?? Date.now(),
        year: String(form.year),
        start_date: form.start_date,
        end_date: form.end_date,
        status: form.status,
        description: form.description,
      };
      onSave?.(payload, !!isEdit);
      toast.show({
        title: isEdit ? "Año modificado" : "Año registrado",
        message: isEdit ? "Se actualizó correctamente" : "Se creó correctamente",
        type: "success",
        duration: 3000,
      });
      onClose?.();
    } catch (err) {
      setError("Error al guardar");
      toast.show({ title: "Error", message: "Error al guardar", type: "error", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 space-y-5 border-2 border-yellow-400">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className="block font-semibold">Año *</label>
          <input type="number" name="year" value={form.year} onChange={handleChange} placeholder="2025" className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="block font-semibold">Estado</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            <option value="Planificado">Planificado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block font-semibold">Fecha inicio *</label>
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="block font-semibold">Fecha fin *</label>
          <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="block font-semibold">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Notas o comentarios" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Cancelar</button>
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg border-2 border-yellow-400">
          {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default RegistrarAño;



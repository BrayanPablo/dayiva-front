
import React, { useState, useEffect } from "react";
import { fetchGuardians, registerGuardian } from "../services/GuardianService";
import Button from "../shared/Button";
import Input from "../shared/Input";
import Select from "../shared/Select";
import DataTable from "../shared/DataTable";
import { useToast } from "../ui/Toast";

const initialForm = {
  identity_document: "",
  first_name: "",
  last_name: "",
  relationship: "Father",
  email: "",
  phone_number: "",
  address: "",
  status: "Active"
};

const GuardianForm = () => {
  const toast = useToast();
  const [form, setForm] = useState(initialForm);
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchGuardians()
      .then(setGuardians)
      .catch(() => setGuardians([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.identity_document || !form.first_name || !form.last_name || !form.relationship || !form.status) {
      setError("Completa los campos obligatorios");
      return;
    }
    setLoading(true);
    registerGuardian(form)
      .then((guardian) => {
        setSuccess("Apoderado registrado");
        toast.show({ title: "Apoderado registrado", message: "Se registró correctamente", type: "success", duration: 3500 });
        setGuardians((prev) => [...prev, guardian]);
        setForm(initialForm);
      })
      .catch(() => { setError("Error al registrar apoderado"); toast.show({ title: "Error", message: "Error al registrar apoderado", type: "error", duration: 4000 }); })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-xl p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Apoderados</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Input
            label="DNI"
            name="identity_document"
            value={form.identity_document}
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
          <Select
            label="Relación"
            name="relationship"
            value={form.relationship}
            onChange={handleChange}
            required
            options={[
              { value: "Father", label: "Padre" },
              { value: "Mother", label: "Madre" },
              { value: "Tutor", label: "Tutor" },
              { value: "Other", label: "Otro" }
            ]}
          />
        </div>
        <div>
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Teléfono"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
          />
          <Input
            label="Dirección"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
          <Select
            label="Estado"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            options={[
              { value: "Active", label: "Activo" },
              { value: "Inactive", label: "Inactivo" }
            ]}
          />
        </div>
        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
          <Button 
            type="submit" 
            disabled={loading}
            loading={loading}
            variant="primary"
            size="medium"
          >
            Registrar
          </Button>
        </div>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      
      {/* Configuración de columnas para DataTable */}
      {(() => {
        const columns = [
          {
            key: 'identity_document',
            label: 'DNI',
            sortable: true
          },
          {
            key: 'first_name',
            label: 'Nombres',
            sortable: true
          },
          {
            key: 'last_name',
            label: 'Apellidos',
            sortable: true
          },
          {
            key: 'relationship',
            label: 'Relación',
            sortable: true
          },
          {
            key: 'email',
            label: 'Email',
            sortable: true
          },
          {
            key: 'phone_number',
            label: 'Teléfono',
            sortable: true
          },
          {
            key: 'status',
            label: 'Estado',
            sortable: true,
            render: (value) => (
              <span className={`text-sm px-3 py-1 rounded-full ${
                value === 'Active' ? 'bg-green-100 text-green-700' : 
                'bg-red-100 text-red-700'
              }`}>
                {value}
              </span>
            )
          }
        ];

        const searchFields = ['first_name', 'last_name', 'identity_document', 'email'];

        return (
          <div className="mt-4">
            <DataTable
              data={guardians}
              columns={columns}
              searchFields={searchFields}
              itemsPerPage={10}
              loading={false}
              className="border-0"
            />
          </div>
        );
      })()}
    </div>
  );
};

export default GuardianForm;


import React, { useState, useEffect } from "react";
import { fetchGuardians } from "../services/GuardianService";
import Input from "../shared/Input";
import DataTable from "../shared/DataTable";
import { useToast } from "../ui/Toast";

// Módulo de Apoderados en modo solo lectura: sin formulario de registro

const GuardianForm = () => {
  const toast = useToast();
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGuardians()
      .then(setGuardians)
      .catch(() => setGuardians([]));
  }, []);

  // Sin manejadores de registro/edición/eliminación

  return (
    <div className="max-w-5xl mx-auto bg-white shadow rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Lista de Apoderados</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      
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
            key: 'phone_number',
            label: 'Celular',
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

        const searchFields = ['first_name', 'last_name', 'identity_document', 'phone_number'];

        return (
          <div className="mt-4">
            <DataTable
              data={guardians}
              columns={columns}
              searchFields={searchFields}
              itemsPerPage={10}
              loading={loading}
              className="border-0"
            />
          </div>
        );
      })()}
    </div>
  );
};

export default GuardianForm;

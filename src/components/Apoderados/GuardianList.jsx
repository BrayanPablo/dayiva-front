import { useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { fetchGuardians } from "../services/GuardianService";

export default function GuardianList() {
  const [guardians, setGuardians] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchGuardians();
        setGuardians(data || []);
      } catch (e) {
        setError("Error al obtener apoderados");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Apoderados</h1>
      {error && <div className="text-red-600 text-sm font-medium mb-3">{error}</div>}
      {(() => {
        const columns = [
          { key: 'identity_document', label: 'DNI', sortable: true },
          { key: 'first_name', label: 'Nombres', sortable: true },
          { key: 'last_name', label: 'Apellidos', sortable: true },
          { key: 'relationship', label: 'Relación', sortable: true },
          { key: 'phone_number', label: 'Celular', sortable: true },
          {
            key: 'status',
            label: 'Estado',
            sortable: true,
            render: (value) => (
              <span className={`text-base px-3 py-2 rounded-full ${
                value === 'Activo' || value === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {value}
              </span>
            )
          }
        ];

        const searchFields = ['identity_document', 'first_name', 'last_name', 'phone_number'];

        return (
          <div className="rounded-2xl shadow-lg border-2 border-yellow-400 bg-white w-full">
            <DataTable
              data={guardians}
              columns={columns}
              searchFields={searchFields}
              itemsPerPage={10}
              loading={loading}
              // Lista de solo lectura: sin acciones
              onEdit={undefined}
              onDelete={undefined}
              className="border-0"
            />
          </div>
        );
      })()}
    </div>
  );
}



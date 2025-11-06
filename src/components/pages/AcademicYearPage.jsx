import React from "react";
import RegistrarAño from "../PeriodoAcademico/RegistrarAño";
import ListaAños from "../PeriodoAcademico/ListaAños";
import { useToast } from "../ui/Toast";
import { apiGet, apiPost, apiPut, apiDelete } from "../../utils/api";

export default function AcademicYearPage() {
  const toast = useToast();
  const [showYearModal, setShowYearModal] = React.useState(false);
  const [editingYear, setEditingYear] = React.useState(null);
  const [years, setYears] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await apiGet('/api/academic-years');
        if (!res.ok) throw new Error('Error al cargar años');
        const data = await res.json();
        setYears(Array.isArray(data) ? data : []);
      } catch (e) {
        toast.show({ title: 'Error', message: 'No se pudo cargar años académicos', type: 'error', duration: 3500 });
      }
    })();
  }, []);

  const handleSaveYear = async (payload, isEdit) => {
    try {
      let res;
      if (isEdit) {
        res = await apiPut(`/api/academic-years/${payload.id}`, payload);
      } else {
        const { id, ...createBody } = payload; // id lo genera el backend
        res = await apiPost('/api/academic-years', createBody);
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Error al guardar');
      }
      const data = await res.json();

      setYears((prev) => {
        const exists = prev.some((y) => y.id === data.id);
        if (exists) return prev.map((y) => (y.id === data.id ? data : y));
        return [data, ...prev];
      });
      setEditingYear(null);
      setShowYearModal(false);
      toast.show({ title: 'Año académico', message: 'Guardado correctamente', type: 'success', duration: 2500 });
    } catch (e) {
      toast.show({ title: 'Error', message: e.message || 'Error al guardar', type: 'error', duration: 3500 });
    }
  };

  return (
    <div className="w-full max-w-full px-3 md:px-6 lg:px-8">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold mb-0 text-gray-800">Año Académico</h2>
        <button className="btn btn-primary" onClick={() => { setEditingYear(null); setShowYearModal(true); }}>+ Nuevo Año</button>
      </div>

      <div className="rounded-2xl shadow-lg border-2 border-blue-400 bg-white w-full">
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Años Académicos</h3>
        </div>
        <div className="p-6">
          <ListaAños
            items={years}
            onEdit={(y) => { setEditingYear(y); setShowYearModal(true); }}
            onDelete={async (y) => {
              if (!window.confirm(`¿Eliminar el año ${y.year}?`)) return;
              // Integración con backend
              try {
                const res = await apiDelete(`/api/academic-years/${y.id}`);
                if (!res.ok) throw new Error('No se pudo eliminar');
                setYears(prev => prev.filter(item => item.id !== y.id));
                toast.show({ title: 'Año eliminado', message: 'Se eliminó correctamente', type: 'success', duration: 2500 });
              } catch (e) {
                toast.show({ title: 'Error', message: e.message || 'Error al eliminar', type: 'error', duration: 3500 });
              }
            }}
          />
        </div>
      </div>

      {showYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-300/60 backdrop-blur-sm">
          <div className="bg-base-100 rounded-2xl shadow-xl p-8 w-full max-w-3xl border border-base-200 relative">
            <button className="absolute top-3 right-3 text-primary hover:opacity-80 text-2xl font-bold" onClick={() => { setShowYearModal(false); setEditingYear(null); }} title="Cerrar">×</button>
            <h2 className="text-2xl font-bold mb-6 text-base-content">{editingYear ? "Editar Año" : "Registrar Año"}</h2>
            <RegistrarAño isEdit={!!editingYear} yearItem={editingYear} onClose={() => { setShowYearModal(false); setEditingYear(null); }} onSave={handleSaveYear} />
          </div>
        </div>
      )}
    </div>
  );
}



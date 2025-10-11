import React from "react";
import RegistrarAño from "../PeriodoAcademico/RegistrarAño";
import ListaAños from "../PeriodoAcademico/ListaAños";
import { useToast } from "../ui/Toast";

export default function AcademicYearPage() {
  const toast = useToast();
  const [showYearModal, setShowYearModal] = React.useState(false);
  const [editingYear, setEditingYear] = React.useState(null);
  const [years, setYears] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/academic-years');
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
        res = await fetch(`/api/academic-years/${payload.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        const { id, ...createBody } = payload; // id lo genera el backend
        res = await fetch('/api/academic-years', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createBody),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al guardar');

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
        <h2 className="text-3xl font-bold mb-0 text-black-700">Año Académico</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow font-bold text-lg" onClick={() => { setEditingYear(null); setShowYearModal(true); }}>+ Nuevo Año</button>
      </div>

      <ListaAños
        items={years}
        onEdit={(y) => { setEditingYear(y); setShowYearModal(true); }}
        onDelete={async (y) => {
          if (!window.confirm(`¿Eliminar el año ${y.year}?`)) return;
          // Integración con backend
          try {
            const res = await fetch(`/api/academic-years/${y.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('No se pudo eliminar');
            setYears(prev => prev.filter(item => item.id !== y.id));
            toast.show({ title: 'Año eliminado', message: 'Se eliminó correctamente', type: 'success', duration: 2500 });
          } catch (e) {
            toast.show({ title: 'Error', message: e.message || 'Error al eliminar', type: 'error', duration: 3500 });
          }
        }}
      />

      {showYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "transparent" }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl border-4 border-blue-600 relative">
            <button className="absolute top-3 right-3 text-blue-600 hover:text-blue-900 text-2xl font-bold" onClick={() => { setShowYearModal(false); setEditingYear(null); }} title="Cerrar">×</button>
            <h2 className="text-2xl font-bold mb-6 text-blue-700">{editingYear ? "Editar Año" : "Registrar Año"}</h2>
            <RegistrarAño isEdit={!!editingYear} yearItem={editingYear} onClose={() => { setShowYearModal(false); setEditingYear(null); }} onSave={handleSaveYear} />
          </div>
        </div>
      )}
    </div>
  );
}



import React, { useEffect, useState } from 'react';
import { getAllPayments } from '../services/PaymentService';
import { fetchStudents } from '../services/StudentService';
import { fetchEnrollments } from '../services/EnrollmentService';

export default function HomePage() {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    enrollmentsYear: 0,
    monthRevenue: 0,
    pendingCount: 0,
    conceptTotals: { Matricula: 0, Inscripcion: 0, Mensualidad: 0, Otro: 0 }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [students, enrollments, payments] = await Promise.all([
          fetchStudents().catch(() => []),
          fetchEnrollments().catch(() => []),
          getAllPayments().catch(() => [])
        ]);

        const totalStudents = students.length;
        const currentYear = new Date().getFullYear();
        const enrollmentsYear = enrollments.filter(e => {
          const y = e.academic_year || (e.enrollment_date ? new Date(e.enrollment_date).getFullYear() : null);
          return Number(y) === currentYear;
        }).length;

        const now = new Date();
        const ym = `${now.getFullYear()}-${now.getMonth()}`;
        let monthRevenue = 0;
        let pendingCount = 0;
        const conceptTotals = { Matricula: 0, Inscripcion: 0, Mensualidad: 0, Otro: 0 };

        payments.forEach(p => {
          const dt = p.created_at ? new Date(p.created_at) : null;
          const dtKey = dt ? `${dt.getFullYear()}-${dt.getMonth()}` : '';
          const paid = Number(p.paid_amount ?? p.amount ?? 0);
          const concept = (p.type || 'Otro').toString();
          if (dt && dtKey === ym) {
            monthRevenue += paid;
            if (conceptTotals[concept] !== undefined) conceptTotals[concept] += paid; else conceptTotals[concept] = paid;
          }
          const status = p.computed_status || (function(){
            const type = (p.type || '').toString();
            const siblings = Number(p.num_siblings || 0);
            const required = type === 'Mensualidad' ? Math.max(0, 250 - siblings * 30) : Number(p.total_amount ?? p.amount ?? 0);
            const paid2 = Number(p.paid_amount ?? p.amount ?? 0);
            return paid2 >= required ? 'Cancelado' : 'Pendiente';
          })();
          if (status === 'Pendiente') pendingCount += 1;
        });

        setMetrics({ totalStudents, enrollmentsYear, monthRevenue, pendingCount, conceptTotals });
      } catch (_) {}
    };
    load();
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Encabezado con gradiente y colores (ocupa todo el ancho disponible) */}
      <div
        className="w-full rounded-xl p-7 text-base-content border border-base-200 shadow-lg"
        style={{
          background: 'linear-gradient(120deg, rgba(59,130,246,0.35) 0%, rgba(99,102,241,0.25) 45%, rgba(2,6,23,0.45) 100%)'
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm opacity-80">Buenas {now.getHours() < 12 ? 'días' : now.getHours() < 19 ? 'tardes' : 'noches'}, <span className="font-semibold">Administrador</span></div>
            <div className="text-3xl md:text-4xl font-extrabold">Panel de Control</div>
            <div className="text-sm opacity-80">Gestión centralizada con acceso a estadísticas en tiempo real</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{timeStr}</div>
            <div className="text-xs opacity-80">{dateStr}</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card shadow p-4 border border-base-200 bg-blue-500/10">
          <div className="text-sm opacity-60">Estudiantes activos</div>
          <div className="text-3xl font-bold text-blue-600">{metrics.totalStudents}</div>
        </div>
        <div className="card shadow p-4 border border-base-200 bg-violet-500/10">
          <div className="text-sm opacity-60">Matrículas {new Date().getFullYear()}</div>
          <div className="text-3xl font-bold text-violet-600">{metrics.enrollmentsYear}</div>
        </div>
        <div className="card shadow p-4 border border-base-200 bg-primary/10">
          <div className="text-sm opacity-60">Recaudado mes</div>
          <div className="text-3xl font-bold text-primary">S/ {metrics.monthRevenue.toFixed(2)}</div>
        </div>
        <div className="card shadow p-4 border border-base-200 bg-warning/10">
          <div className="text-sm opacity-60">Pagos pendientes</div>
          <div className="text-3xl font-bold text-warning">{metrics.pendingCount}</div>
        </div>
      </div>

      {/* Finanzas por concepto */}
      <div className="card bg-base-100 shadow p-4 border border-base-200">
        <div className="font-semibold mb-2">Ingresos por concepto (mes)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(metrics.conceptTotals).map(([k,v]) => {
            const colorClass = k === 'Matricula' ? 'bg-blue-500/10 text-blue-700'
              : k === 'Inscripcion' ? 'bg-cyan-500/10 text-cyan-700'
              : k === 'Mensualidad' ? 'bg-emerald-500/10 text-emerald-700'
              : 'bg-slate-500/10 text-slate-700';
            return (
              <div key={k} className={`flex items-center justify-between p-3 rounded-lg border border-base-200 ${colorClass}`}>
                <span className="opacity-80">{k}</span>
                <span className="font-semibold">S/ {Number(v).toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



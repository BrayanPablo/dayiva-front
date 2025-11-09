import React, { useEffect, useState } from 'react';
import DataTable from '../shared/DataTable';
import Button from '../shared/Button';
import { getAllPayments, createPayment, deletePayment, updatePayment } from '../services/PaymentService';
import { fetchStudents } from '../services/StudentService';
import StudentSearchModal from '../Estudiantes/StudentSearchModal';

const safeText = (value) => (value === null || value === undefined ? '' : String(value).trim());

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    student_id: '',
    type: 'Matricula',
    amount: '',
    method: 'Efectivo',
    notes: '',
    payer: 'Padre',
    month: '',
    academic_year: '',
    payment_date: new Date().toISOString().split('T')[0]
  });
  const [showStudentModal, setShowStudentModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pays, studs] = await Promise.all([
          getAllPayments(),
          fetchStudents()
        ]);
        
        console.log('📋 Pagos recibidos:', pays);
        if (pays.length > 0) {
          console.log('🔍 Primer pago:', pays[0]);
        }

        setPayments(pays);
        setStudents(studs);
      } catch (error) {
        console.error('Error al cargar pagos:', error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns = [
    { key: 'id', label: 'Código', sortable: true },
    { key: 'student_surnames', label: 'Apellidos', sortable: true, render: (v) => safeText(v) || '-' },
    { key: 'student_names', label: 'Nombres', sortable: true, render: (v, row) => {
      const surnames = safeText(row.student_surnames);
      let namesOnly = safeText(v);
      if (surnames && namesOnly.toLowerCase().startsWith(surnames.toLowerCase())) {
        namesOnly = namesOnly.substring(surnames.length).trim();
      }
      return namesOnly || '-';
    } },
    { key: 'type', label: 'Concepto', sortable: true, render: (v, row) => {
      if (v === 'Mensualidad') {
        let monthName = null;

        if (row.month) {
          const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          monthName = months[parseInt(row.month, 10) - 1] || `Mes ${row.month}`;
        }

        if (!monthName && row.notes) {
          console.log('🔍 Buscando mes en notes:', row.notes);
          const monthMatch = String(row.notes).match(/Mes:\s*(\w+)/);
          console.log('🔍 Resultado regex:', monthMatch);
          if (monthMatch) {
            monthName = monthMatch[1];
          }
        }

        if (monthName) {
          return `${v} - ${monthName}`;
        }
      }
      return v;
    } },
    { key: 'amount', label: 'Importe', sortable: true, render: (v, row) => {
      const amountToShow = row.display_amount !== undefined 
        ? row.display_amount 
        : (row.type === 'Mensualidad' && row.paid_amount !== undefined) 
          ? row.paid_amount 
          : v;
      return <span className="text-blue-600 font-semibold">{`S/ ${Number(amountToShow || 0).toFixed(2)}`}</span>;
    } },
    { key: 'payment_date', label: 'Fecha de Pago', sortable: true, render: (v) => (
      v ? new Date(v).toLocaleDateString('es-PE') : '-'
    ) },
    { key: 'status', label: 'Estado', sortable: true, render: (v, row) => {
      let status = v || row.estado || 'Pendiente';

      if (status === 'Cancelado') {
        status = 'Pagado';
      }

      const expectedAmount = parseFloat(row.expected_amount || 0);
      const paidAmount = parseFloat(row.paid_amount || row.amount || 0);

      if (expectedAmount > 0) {
        if (paidAmount <= 0) {
          status = 'Pendiente';
        } else if (paidAmount >= expectedAmount) {
          status = 'Pagado';
        } else {
          status = 'Parcial';
        }
      } else if (row.notes) {
        const notes = safeText(row.notes);
        const costMatch = notes.match(/Costo:\s*S\/\s*([\d.]+)/);
        const paidMatch = notes.match(/Pagado:\s*S\/\s*([\d.]+)/);

        if (costMatch && paidMatch) {
          const costoEsperado = parseFloat(costMatch[1]);
          const pagado = parseFloat(paidMatch[1]);

          if (pagado <= 0) {
            status = 'Pendiente';
          } else if (pagado >= costoEsperado) {
            status = 'Pagado';
          } else {
            status = 'Parcial';
          }
        }
      }

      const isOverdue = row.is_overdue;
      let badgeClass = 'badge-warning';
      if (status === 'Pagado') {
        badgeClass = 'badge-success';
      } else if (status === 'Parcial') {
        badgeClass = 'badge-info';
      } else if (status === 'Pendiente') {
        badgeClass = 'badge-warning';
      }
      if (isOverdue) badgeClass = 'badge-error';

      return (
        <div className="flex flex-col gap-1">
          <span className={`badge ${badgeClass}`}>{status}</span>
          {isOverdue && <span className="badge badge-error badge-sm">Vencida</span>}
        </div>
      );
    } },
  ];

  const searchFields = ['student_names', 'student_surnames', 'type', 'status'];

  const handleOpenForm = () => {
    setForm({ 
      student_id: '', 
      type: 'Matricula', 
      amount: '', 
      method: 'Efectivo', 
      notes: '', 
      payer: 'Padre',
      month: '',
      academic_year: '',
      payment_date: new Date().toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.student_id) {
        alert('Seleccione un estudiante');
        return;
      }
      const amountNum = Number(form.amount || 0);
      if (!(amountNum > 0)) {
        alert('Ingrese un importe válido (> 0)');
        return;
      }
      const payload = {
        student_id: Number(form.student_id),
        type: form.type,
        amount: amountNum,
        paid_amount: amountNum,
        method: form.method,
        notes: form.notes || '',
        payer: form.payer,
        payment_date: form.payment_date
      };

      if (form.type === 'Mensualidad') {
        if (!form.month || !form.academic_year) {
          alert('Para mensualidades debe seleccionar mes y año académico');
          return;
        }
        payload.month = Number(form.month);
        payload.academic_year = form.academic_year;
      }

      await createPayment(payload);
      const refreshed = await getAllPayments();
      setPayments(refreshed);
      setShowForm(false);
    } catch (err) {
      console.error('Error al registrar pago:', err);
      alert('Error al registrar pago');
    }
  };

  const handleDelete = async (row) => {
    if (!confirm('¿Eliminar pago?')) return;
    try {
      await deletePayment(row.id);
      const refreshed = await getAllPayments();
      setPayments(refreshed);
    } catch (err) { 
      console.error('Error al eliminar pago:', err);
      alert('Error al eliminar pago: ' + (err.message || 'Error desconocido'));
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Pagos</h2>
        <Button variant="primary" onClick={handleOpenForm}>Registrar pago</Button>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        searchFields={searchFields}
        loading={loading}
        onDelete={handleDelete}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded shadow w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Registrar pago</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Estudiante</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={(function(){
                      const s = students.find(x => String(x.id) === String(form.student_id));
                      if (!s) return '';
                      const surnames = safeText(s.surnames);
                      let namesOnly = safeText(s.full_name);
                      if (surnames && namesOnly.toLowerCase().startsWith(surnames.toLowerCase())) namesOnly = namesOnly.substring(surnames.length).trim();
                      return `${s.identity_document || ''} - ${surnames} ${namesOnly}`.trim();
                    })()}
                    placeholder="Seleccione estudiante"
                    readOnly
                  />
                  <Button type="button" variant="secondary" onClick={() => setShowStudentModal(true)}>Buscar</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Concepto</label>
                  <select
                    className="select select-bordered w-full"
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  >
                    <option value="Matricula">Matrícula</option>
                    <option value="Inscripcion">Inscripción</option>
                    <option value="Mensualidad">Mensualidad</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Método</label>
                  <select
                    className="select select-bordered w-full"
                    value={form.method}
                    onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Yape">Yape</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              {form.type === 'Mensualidad' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Mes</label>
                    <select
                      className="select select-bordered w-full"
                      value={form.month}
                      onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                      required
                    >
                      <option value="">Seleccionar mes</option>
                      <option value="1">Enero</option>
                      <option value="2">Febrero</option>
                      <option value="3">Marzo</option>
                      <option value="4">Abril</option>
                      <option value="5">Mayo</option>
                      <option value="6">Junio</option>
                      <option value="7">Julio</option>
                      <option value="8">Agosto</option>
                      <option value="9">Septiembre</option>
                      <option value="10">Octubre</option>
                      <option value="11">Noviembre</option>
                      <option value="12">Diciembre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Año Académico</label>
                    <select
                      className="select select-bordered w-full"
                      value={form.academic_year}
                      onChange={e => setForm(f => ({ ...f, academic_year: e.target.value }))}
                      required
                    >
                      <option value="">Seleccionar año</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Importe</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input input-bordered w-full"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Pagador</label>
                  <div className="flex items-center gap-4 h-12">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="payer" className="radio" checked={form.payer === 'Padre'} onChange={() => setForm(f => ({ ...f, payer: 'Padre' }))} /> Padre
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="payer" className="radio" checked={form.payer === 'Madre'} onChange={() => setForm(f => ({ ...f, payer: 'Madre' }))} /> Madre
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="payer" className="radio" checked={form.payer === 'Otro'} onChange={() => setForm(f => ({ ...f, payer: 'Otro' }))} /> Otro
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Fecha de Pago</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={form.payment_date}
                    onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Descripción</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows={3}
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)} type="button">Cancelar</Button>
                <Button variant="primary" type="submit">Guardar</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStudentModal && (
        <StudentSearchModal
          isOpen={showStudentModal}
          onClose={() => setShowStudentModal(false)}
          onSelectStudent={(stu) => setForm(f => ({ ...f, student_id: stu.id }))}
          title="Buscar Estudiante"
        />
      )}
    </div>
  );
};

export default PaymentsPage;


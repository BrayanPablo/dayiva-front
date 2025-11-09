import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import { fetchStudentPaymentHistory } from '../services/StudentService';

const formatCurrency = (value) => {
  const number = Number(value || 0);
  return `S/ ${number.toFixed(2)}`;
};

const formatDate = (date) => {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString('es-PE');
  } catch (error) {
    return date;
  }
};

const statusBadgeClass = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'pagado':
      return 'badge badge-success';
    case 'parcial':
      return 'badge badge-info';
    case 'vencido':
    case 'vencida':
      return 'badge badge-error';
    case 'pendiente':
    default:
      return 'badge badge-warning';
  }
};

const StudentPaymentHistoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchStudentPaymentHistory(id);
        setHistory(data);
      } catch (err) {
        console.error('Error al cargar historial de pagos:', err);
        setError(err.message || 'Error al cargar historial de pagos');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-600">Cargando historial de pagos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-error/10 border border-error rounded-xl p-6">
          <h2 className="text-xl font-semibold text-error mb-2">No se pudo cargar el historial</h2>
          <p className="text-error/80 mb-4">{error}</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Volver</Button>
        </div>
      </div>
    );
  }

  const { student, enrollments = [] } = history || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historial de Pagos</h1>
          <p className="text-gray-600 mt-1">
            Consulta los pagos realizados y programados del estudiante.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Volver
          </Button>
          <Button variant="secondary" onClick={() => navigate('/payments')}>
            Ir a Pagos
          </Button>
        </div>
      </div>

      <section className="bg-base-100 rounded-xl shadow-sm border border-base-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Datos del Estudiante</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-gray-500 uppercase text-xs mb-1">Nombre completo</span>
            <span className="font-medium text-gray-900">{student?.full_name || '—'}</span>
          </div>
          <div>
            <span className="block text-gray-500 uppercase text-xs mb-1">DNI</span>
            <span className="font-medium text-gray-900">{student?.identity_document || '—'}</span>
          </div>
          <div>
            <span className="block text-gray-500 uppercase text-xs mb-1">Apellidos</span>
            <span className="font-medium text-gray-900">{student?.surnames || '—'}</span>
          </div>
          <div>
            <span className="block text-gray-500 uppercase text-xs mb-1">Nombres</span>
            <span className="font-medium text-gray-900">{student?.names || '—'}</span>
          </div>
        </div>
      </section>

      {enrollments.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-xl p-6 text-gray-600">
          El estudiante aún no cuenta con matrículas registradas.
        </div>
      ) : (
        enrollments.map((enrollment) => {
          const nonMonthlyPayments = (enrollment.payments || []).filter(
            (payment) => payment.concept !== 'Mensualidad'
          );

          return (
            <section key={enrollment.id} className="bg-base-100 border border-base-200 rounded-xl shadow-sm">
              <div className="border-b border-base-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    {enrollment.academic_year ? `Año ${enrollment.academic_year}` : 'Matrícula'}
                    <span className="badge badge-outline">{enrollment.grade.name || 'Grado no asignado'}</span>
                    {enrollment.grade.level && (
                      <span className="badge badge-outline badge-ghost">{enrollment.grade.level}</span>
                    )}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-4">
                    <span>Código: {enrollment.enrollment_code || '—'}</span>
                    <span>Fecha: {formatDate(enrollment.enrollment_date)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                  <span className={`badge px-4 py-2 text-sm ${statusBadgeClass(enrollment.status)}`}>
                    {enrollment.status || 'Sin estado'}
                  </span>
                  <div className="text-xs text-gray-500">
                    Total pagado: <strong>{formatCurrency(enrollment.totals.general)}</strong>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-6">
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-3">
                    Pagos de Matrícula e Inscripción
                  </h4>
                  {nonMonthlyPayments.length === 0 ? (
                    <div className="text-sm text-gray-500">No se registran pagos de matrícula o inscripción.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table table-sm w-full">
                        <thead>
                          <tr className="text-xs uppercase text-gray-500">
                            <th>Concepto</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                            <th>Método</th>
                            <th>Estado</th>
                            <th>Comprobante</th>
                            <th>Notas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nonMonthlyPayments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="font-medium text-gray-800">{payment.concept}</td>
                              <td>{formatCurrency(payment.amount)}</td>
                              <td>{formatDate(payment.payment_date)}</td>
                              <td>{payment.method || '—'}</td>
                              <td>
                                <span className={statusBadgeClass(payment.status)}>{payment.status}</span>
                              </td>
                              <td>{payment.receipt_number || '—'}</td>
                              <td className="max-w-xs whitespace-pre-wrap text-xs text-gray-500">
                                {payment.notes || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-3">
                    Programación de Mensualidades
                  </h4>
                  {enrollment.monthly_schedule.length === 0 ? (
                    <div className="text-sm text-gray-500">No se ha generado la programación de mensualidades para esta matrícula.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table table-sm w-full">
                        <thead>
                          <tr className="text-xs uppercase text-gray-500">
                            <th>Mes</th>
                            <th>Monto</th>
                            <th>Pagado</th>
                            <th>Pendiente</th>
                            <th>Estado</th>
                            <th>Vence</th>
                            <th>Pagos realizados</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrollment.monthly_schedule.map((monthly) => (
                            <tr key={monthly.id}>
                              <td className="font-medium text-gray-800">{monthly.month_name}</td>
                              <td>{formatCurrency(monthly.expected_amount)}</td>
                              <td>{formatCurrency(monthly.total_paid)}</td>
                              <td>{formatCurrency(monthly.remaining_amount)}</td>
                              <td>
                                <span className={statusBadgeClass(monthly.status)}>{monthly.status}</span>
                              </td>
                              <td>{formatDate(monthly.due_date)}</td>
                              <td>
                                {monthly.payments && monthly.payments.length > 0 ? (
                                  <div className="flex flex-col gap-1 text-xs text-gray-600">
                                    {monthly.payments.map((monthlyPayment) => (
                                      <div key={monthlyPayment.id} className="flex items-center gap-2">
                                        <span>{formatDate(monthlyPayment.payment_date)}</span>
                                        <span className="font-semibold">{formatCurrency(monthlyPayment.amount)}</span>
                                        <span className="badge badge-ghost badge-sm">{monthlyPayment.method || '—'}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">Sin pagos registrados</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
};

export default StudentPaymentHistoryPage;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useToast } from "../ui/Toast";
import { fetchEnrollments, deleteEnrollment, fetchEnrollmentFullById } from "../services/EnrollmentService";
import EnrollmentReceipt from "./EnrollmentReceipt";

const EnrollmentList = ({ refresh }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHtmlReceipt, setShowHtmlReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [pdfReceiptData, setPdfReceiptData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const enrollmentsPerPage = 10;

  const safeText = (value) => (value === null || value === undefined ? '' : String(value).trim());

  const getStudentParts = (enrollment) => {
    const surnamesRaw = safeText(enrollment.student_surnames);
    const namesRaw = safeText(enrollment.student_names);
    if (surnamesRaw || namesRaw) {
      return {
        surnames: surnamesRaw,
        names: namesRaw,
      };
    }

    const full = safeText(enrollment.student);
    if (!full) {
      return { surnames: '', names: '' };
    }

    const parts = full.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return { surnames: '', names: parts[0] };
    }

    const surnamesGuess = parts.slice(0, Math.min(2, parts.length - 1)).join(' ');
    const namesGuess = parts.slice(Math.min(2, parts.length - 1)).join(' ') || parts[parts.length - 1];

    return {
      surnames: surnamesGuess,
      names: namesGuess,
    };
  };
  const pdfRef = useRef(null);

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const data = await fetchEnrollments();
      setEnrollments(data);
      setFilteredEnrollments(data);
    } catch (err) {
      toast.show({ title: "Error", message: err.message, type: "error", duration: 3500 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, [refresh]);

  // Filtrar matrículas cuando cambie el término de búsqueda o el filtro de grado
  useEffect(() => {
    let filtered = enrollments;

    // Filtrar por nombre del estudiante
    if (searchTerm !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(enrollment => {
        const { surnames, names } = getStudentParts(enrollment);
        const combined = `${surnames} ${names} ${safeText(enrollment.student)}`.toLowerCase();
        return combined.includes(term);
      });
    }

    // Filtrar por grado y nivel
    if (selectedGradeLevel !== '') {
      filtered = filtered.filter(enrollment => 
        enrollment.grade === selectedGradeLevel
      );
    }

    setFilteredEnrollments(filtered);
    setCurrentPage(1); // Reset a la primera página cuando se busca o filtra
  }, [searchTerm, selectedGradeLevel, enrollments]);

  // Manejar cambio de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejar cambio del filtro de grado
  const handleGradeLevelChange = (e) => {
    setSelectedGradeLevel(e.target.value);
  };

  // Obtener lista única de grados para el filtro
  const getUniqueGrades = () => {
    const grades = enrollments.map(enrollment => enrollment.grade).filter(Boolean);
    return [...new Set(grades)].sort();
  };

  // Paginación
  const totalPages = Math.ceil(filteredEnrollments.length / enrollmentsPerPage);
  const startIndex = (currentPage - 1) * enrollmentsPerPage;
  const endIndex = startIndex + enrollmentsPerPage;
  const currentEnrollments = filteredEnrollments.slice(startIndex, endIndex);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta matrícula?")) return;
    try {
      await deleteEnrollment(id);
      setEnrollments(prev => prev.filter(e => e.id !== id));
      toast.show({ title: "Matrícula eliminada", message: "Se eliminó correctamente", type: "success", duration: 2500 });
    } catch (err) {
      toast.show({ title: "Error", message: err.message, type: "error", duration: 3500 });
    }
  };

  const handleDownloadFichaPdf = async (enrollment) => {
    try {
      const full = await fetchEnrollmentFullById(enrollment.id);
      const isNew = Number(full?.payments?.inscription || 0) > 0; // si hay inscripción, tratamos como alumno nuevo
      const data = {
        year: Number(full.academic_year) || new Date().getFullYear(),
        isNew,
        student: { 
          surnames: full.student?.surnames || '', 
          names: (full.student?.full_name || '').replace((full.student?.surnames||''),'').trim(), 
          dni: full.student?.identity_document || '', 
          address: full.student?.address || '', 
          gradeName: full.grade?.name || '' ,
          gradeLevel: full.grade?.level || ''
        },
        father: full.father || {},
        mother: full.mother || {},
        payments: { 
          inscription: isNew && full.payments?.inscription ? `S/ ${Number(full.payments.inscription).toFixed(2)}` : '', 
          tuition: full.payments?.tuition ? `S/ ${Number(full.payments.tuition).toFixed(2)}` : '', 
          date: (full.payments?.tuition_date || full.payments?.inscription_date) ? new Date(full.payments.tuition_date || full.payments.inscription_date).toLocaleDateString() : new Date().toLocaleDateString(), 
          total: full.payments?.total ? `S/ ${Number(full.payments.total).toFixed(2)}` : '' 
        }
      };
      setPdfReceiptData(data);
      setTimeout(() => {
        const el = pdfRef.current;
        if (!el) return;
        const ensureRenderAndExport = (attempt = 1) => {
          const rect = el.getBoundingClientRect();
          if ((rect.width < 10 || rect.height < 10) && attempt <= 3) {
            setTimeout(() => ensureRenderAndExport(attempt + 1), 250);
            return;
          }
          const filename = `Ficha_${(enr?.student || 'matricula').replace(/\s+/g, '_')}.pdf`;
          html2pdf()
            .set({
              filename,
              margin: 10,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                imageTimeout: 0,
                background: '#ffffff',
                foreignObjectRendering: true,
                onclone: (clonedDoc) => {
                  clonedDoc.documentElement.style.background = '#ffffff';
                  clonedDoc.body.style.background = '#ffffff';
                  clonedDoc.documentElement.removeAttribute('data-theme');
                  const style = clonedDoc.createElement('style');
                  style.id = 'pdf-oklch-fix';
                  style.textContent = `
                    [data-pdf-root="1"], [data-pdf-root="1"] * {
                      background: #ffffff !important;
                      background-color: #ffffff !important;
                      color: #000000 !important;
                      border-color: #000000 !important;
                      box-shadow: none !important;
                      outline-color: #000000 !important;
                    }
                  `;
                  clonedDoc.head.appendChild(style);
                  const scope = clonedDoc.querySelector('[data-pdf-root="1"]');
                  if (!scope) return;
                  const all = scope.querySelectorAll('*');
                  all.forEach((node) => {
                    const cs = clonedDoc.defaultView.getComputedStyle(node);
                    const bg = cs.backgroundColor || '';
                    if (bg.includes('oklch')) node.style.backgroundColor = '#ffffff';
                    const color = cs.color || '';
                    if (color.includes('oklch')) node.style.color = '#000000';
                    ['Top','Right','Bottom','Left'].forEach(side => {
                      const bc = cs[`border${side}Color`] || '';
                      if (bc.includes('oklch')) node.style[`border${side}Color`] = '#000000';
                    });
                  });
                }
              },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            })
            .from(el)
            .save();
        };
        ensureRenderAndExport();
      }, 300);
    } catch (e) {
      toast.show({ title: 'Error', message: 'No se pudo generar la ficha PDF', type: 'error', duration: 3500 });
    }
  };

  const handlePrintHtml = async (enrollment) => {
    try {
      const full = await fetchEnrollmentFullById(enrollment.id);
      const isNew = Number(full?.payments?.inscription || 0) > 0; // controlar título/filas por inscripción
      const data = {
        year: Number(full.academic_year) || new Date().getFullYear(),
        isNew,
        student: { 
          surnames: full.student?.surnames || '', 
          names: (full.student?.full_name || '').replace((full.student?.surnames||''),'').trim(), 
          dni: full.student?.identity_document || '', 
          address: full.student?.address || '', 
          gradeName: full.grade?.name || '' ,
          gradeLevel: full.grade?.level || ''
        },
        father: full.father || {},
        mother: full.mother || {},
        payments: { 
          inscription: isNew && full.payments?.inscription ? `S/ ${Number(full.payments.inscription).toFixed(2)}` : '', 
          tuition: full.payments?.tuition ? `S/ ${Number(full.payments.tuition).toFixed(2)}` : '', 
          date: (full.payments?.tuition_date || full.payments?.inscription_date) ? new Date(full.payments.tuition_date || full.payments.inscription_date).toLocaleDateString() : new Date().toLocaleDateString(), 
          total: full.payments?.total ? `S/ ${Number(full.payments.total).toFixed(2)}` : '' 
        }
      };
      setReceiptData(data);
      setShowHtmlReceipt(true);
      setTimeout(() => window.print(), 300);
    } catch (e) {
      toast.show({ title: 'Error', message: 'No se pudo abrir la ficha HTML', type: 'error', duration: 3500 });
    }
  };

  // Manejar acciones
  const handleView = (enrollment) => {
    alert('Ver detalles — por implementar');
  };

  const handleEdit = (enrollment) => {
    alert('Funcionalidad de edición pendiente');
  };

  const handleShowPaymentHistory = (enrollment) => {
    if (!enrollment?.student_id) {
      toast.show({ title: 'Información incompleta', message: 'No se encontró el estudiante asociado a esta matrícula.', type: 'warning', duration: 3000 });
      return;
    }
    navigate(`/students/${enrollment.student_id}/payments`);
  };

  return (
    <div className="w-full">
      {/* Barra de búsqueda y filtros */}
      <div className="w-full mb-6 space-y-4">
        {/* Búsqueda por nombre del estudiante */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre del estudiante..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="input input-bordered w-full pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filtro por grado */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Filtrar por Grados:</span>
          <div className="relative">
            <select
              value={selectedGradeLevel}
              onChange={handleGradeLevelChange}
              className="select select-bordered w-full max-w-xs bg-white"
            >
              <option value="">Selecciona un grado</option>
              {getUniqueGrades().map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </div>
          </div>
          {selectedGradeLevel && (
            <button
              onClick={() => setSelectedGradeLevel('')}
              className="btn btn-sm btn-outline"
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </div>

      <div className="w-full pb-4 flex-1 flex items-start">
        <div className="w-full">
          <div className="w-full">
            <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900">Lista de Matrículas</h3>
              </div>
              
              <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-130px)]">
                <table className="table table-sm w-full">
                  <thead className="">
                    <tr>
                      <th className="p-4 text-left text-xs font-semibold uppercase">
                        Apellidos
                      </th>
                      <th className="p-4 text-left text-xs font-semibold uppercase">
                        Nombres
                      </th>
                      <th className="p-4 text-left text-xs font-semibold uppercase">
                        Grado
                      </th>
                      <th className="p-4 text-center text-xs font-semibold uppercase">
                        Estado
                      </th>
                      <th className="p-4 text-center text-xs font-semibold uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="p-6 text-center">
                          <span className="loading loading-spinner loading-lg text-primary"></span>
                        </td>
                      </tr>
                    ) : currentEnrollments.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-6 text-center opacity-70">
                          {searchTerm || selectedGradeLevel ? 'No se encontraron matrículas con ese criterio' : 'No hay matrículas registradas'}
                        </td>
                      </tr>
                    ) : (
                      currentEnrollments.map((enrollment) => {
                        const { surnames, names } = getStudentParts(enrollment);
                        return (
                        <tr key={enrollment.id} className="hover">
                          <td className="p-4">
                            <div className="font-medium text-gray-900">
                              {surnames || 'N/A'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900">
                              {names || 'N/A'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-600">
                              {enrollment.grade || 'N/A'}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                              enrollment.status === 'Activo' ? 'bg-green-200 text-green-800 border border-green-300' : 
                              enrollment.status === 'Retirado' ? 'bg-red-200 text-red-800 border border-red-300' :
                              'bg-gray-200 text-gray-800 border border-gray-300'
                            }`}>
                              {enrollment.status || 'N/A'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-3 justify-center items-center">
                              <button
                                onClick={() => handleView(enrollment)}
                                className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                                title="Ver detalles"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEdit(enrollment)}
                                className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                                title="Editar matrícula"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleShowPaymentHistory(enrollment)}
                                className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                                title="Historial de pagos"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.306 0 2.418.835 2.84 2m-2.84-2V6m0 10v2m7-10a9 9 0 11-14 7.5" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handlePrintHtml(enrollment)}
                                className="w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                                title="Imprimir ficha"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(enrollment.id)}
                                className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                                title="Eliminar matrícula"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Controles de paginación */}
              {filteredEnrollments.length > enrollmentsPerPage && (
                <div className="px-6 py-3 bg-base-100 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-70">
                      Mostrando {startIndex + 1} a {Math.min(endIndex, filteredEnrollments.length)} de {filteredEnrollments.length} matrículas
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="btn btn-sm btn-outline"
                      >
                        Anterior
                      </button>
                      <span className="flex items-center px-3 text-sm">
                        Página {currentPage} de {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="btn btn-sm btn-outline"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Contenedor oculto para exportar a PDF desde la lista */}
      <div style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none', zIndex: -1 }} aria-hidden>
        {pdfReceiptData && (
          <div ref={pdfRef} data-pdf-root="1" style={{ background: '#ffffff', color: '#000000', width: '210mm' }}>
            <EnrollmentReceipt {...pdfReceiptData} />
          </div>
        )}
      </div>
      {showHtmlReceipt && receiptData && (
        <div className="fixed inset-0 z-40 bg-white overflow-auto p-6">
          <div className="no-print mb-4 flex justify-end">
            <button onClick={() => setShowHtmlReceipt(false)} className="btn">Cerrar vista</button>
          </div>
          <EnrollmentReceipt {...receiptData} />
        </div>
      )}
    </div>
  );
};

export default EnrollmentList;

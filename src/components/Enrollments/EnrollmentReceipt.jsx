import React from "react";

/**
 * Componente imprimible para la Ficha de Matrícula (HTML/React)
 * - Replica la estructura de la imagen: una sola tabla grande desde
 *   "DATOS DEL ESTUDIANTE" hasta "DNI/CEL (madre)", y una segunda tabla de PAGO.
 * - Usa solo HTML+CSS (sin dependencias). Funciona con imprimir → Guardar como PDF.
 * - Todos los campos no ingresados se muestran vacíos (""), nunca null.
 *
 * Props sugeridas (puedes pasar solo lo que tengas):
 * {
 *   year: 2025,
 *   student: {
 *      surnames, names, dni, address, gradeName, gradeLevel,
 *      provenance, provenanceCode
 *   },
 *   father: { fullName, dni, phone },
 *   mother: { fullName, dni, phone },
 *   isNew: true | false,
 *   payments: { inscription, tuition, date, total }
 * }
 */
export default function EnrollmentReceipt({
  year = new Date().getFullYear(),
  student = {},
  father = {},
  mother = {},
  isNew = true,
  payments = {},
  style = {},
}) {
  // Helpers de valores vacíos
  const v = (x) => (x ? String(x) : "");
  const gradeText = [v(student.gradeName), student.gradeLevel ? `(${student.gradeLevel})` : ""].filter(Boolean).join(" ");

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", color: "#000", ...style }}>
      <style>
        {`
        @media print {
          @page { size: A4; margin: 10mm; }
          .no-print { display: none !important; }
        }
        .sheet { width: 100%; border: 3px solid #1e40af; padding: 12px; box-sizing: border-box; min-height: 260mm; position: relative; }
        .title {
          text-align: center;
          margin-bottom: 12px;
        }
        .title .row { display: flex; align-items: center; justify-content: center; gap: 16px; }
        .logo { width: 64px; height: 64px; object-fit: contain; }
        .subtitle {
          text-align: center;
          margin-bottom: 8px;
        }
        .content { margin: 6mm 4mm; }
        table.form {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          margin-bottom: 30px;
        }
        table.form th, table.form td {
          border: 1px solid #000;
          padding: 10px 12px;
          vertical-align: middle;
          word-break: break-word;
          font-size: 14px;
        }
        .heading-row th {
          text-align: center;
          font-weight: 700;
          background: #fff;
        }
        .label { font-weight: 700; }
        table.inner { width: 100%; border-collapse: collapse; table-layout: fixed; }
        table.inner td { border: 1px solid #000; padding: 10px 12px; font-size: 14px; }
        .sign-box {
          position: absolute;
          bottom: 20px;
          right: 20px;
          text-align: center;
        }
        .school-name {
          position: absolute;
          bottom: 20px;
          left: 20px;
          text-align: center;
          font-weight: 700;
        }
        .admin-line { margin: 0 auto 10px; width: 240px; border-top: 1px solid #000; height: 1px; }
        .line { margin: 0 auto 10px; width: 240px; border-top: 1px solid #000; height: 1px; }
        .total-sello-cell {
          height: 60px;
          vertical-align: top;
        }
      `}
      </style>

      <div className="sheet">
        <div className="title">
          <div className="row">
            <img src="/logo.png" alt="logo" className="logo" crossOrigin="anonymous" />
            <div>
              <div style={{ fontSize: 12 }}>Año del bicentenario de José Faustino Sánchez Carrión</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>FICHA DE MATRÍCULA</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>ALUMNOS {isNew ? "NUEVOS" : "PROMOVIDOS"} - DAYIVA SCHOOL {year}</div>
            </div>
            <img src="/logo.png" alt="logo" className="logo" crossOrigin="anonymous" />
          </div>
        </div>

        <div className="content">
        {/* TABLA PRINCIPAL - DATOS DEL ESTUDIANTE (3 columnas: etiqueta | valor1 | valor2) */}
        <table className="form">
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "36%" }} />
            <col style={{ width: "36%" }} />
          </colgroup>
          <thead>
            <tr className="heading-row">
            <th colSpan={3}>DATOS DEL ESTUDIANTE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="row">APELLIDOS</td>
              <td className="value" colSpan={2}>{v(student.surnames)}</td>
            </tr>
            <tr>
              <td className="row">NOMBRES</td>
              <td className="value" colSpan={2}>{v(student.names)}</td>
            </tr>
            {isNew && (
              <tr>
                <td className="row">COLEGIO DE PROCEDENCIA / CÓDIGO</td>
                <td className="value" colSpan={2}>
                  {[v(student.provenance), v(student.provenanceCode)].filter(Boolean).join("  /  ")}
                </td>
              </tr>
            )}
            <tr>
              <td className="row">MATRÍCULA EN</td>
              <td className="value" colSpan={2}>{gradeText}</td>
            </tr>
            <tr>
              <td className="row">DNI</td>
              <td className="value" colSpan={2}>{v(student.dni)}</td>
            </tr>
            <tr>
              <td className="row">DIRECCIÓN</td>
              <td className="value" colSpan={2}>{v(student.address)}</td>
            </tr>

            {/* PADRE */}
            <tr>
              <td className="row">PADRE</td>
              <td className="value" colSpan={2}>{v(father.fullName)}</td>
            </tr>
            <tr>
              <td className="row">DNI / CEL.</td>
              <td className="value">{v(father.dni)}</td>
              <td className="value">{v(father.phone)}</td>
            </tr>

            {/* MADRE */}
            <tr>
              <td className="row">MADRE</td>
              <td className="value" colSpan={2}>{v(mother.fullName)}</td>
            </tr>
            <tr>
              <td className="row">DNI / CEL.</td>
              <td className="value">{v(mother.dni)}</td>
              <td className="value">{v(mother.phone)}</td>
            </tr>
          </tbody>
        </table>

        {/* TABLA PAGO (2 columnas x N filas) */}
        <table className="form">
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "36%" }} />
            <col style={{ width: "36%" }} />
          </colgroup>
          <thead>
            <tr className="heading-row">
              <th colSpan={3}>PAGO</th>
            </tr>
          </thead>
          <tbody>
            {isNew && (
              <tr>
                <td className="row">INSCRIPCIÓN</td>
                <td colSpan={2}>{v(payments.inscription)}</td>
              </tr>
            )}
            <tr>
              <td className="row">MATRÍCULA</td>
              <td colSpan={2}>{v(payments.tuition)}</td>
            </tr>
            <tr>
              <td className="row">FECHA</td>
              <td colSpan={2}>{v(payments.date)}</td>
            </tr>
            <tr>
              <td className="row">TOTAL Y SELLO</td>
              <td className="total-sello-cell">{v(payments.total)}</td>
              <td className="total-sello-cell"></td>
            </tr>
          </tbody>
        </table>
        </div>

        {/* Firma */}
        <div className="sign-box">
          <div className="line" />
          <div>Responsable del menor</div>
        </div>

        {/* Nombre de la institución */}
        <div className="school-name">
          <div className="admin-line" />
          I.E.P. Dayiva School
        </div>
      </div>
    </div>
  );
}



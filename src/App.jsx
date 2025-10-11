import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/Login/LoginForm.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import RequireRoles from "./router/RequireRoles.jsx";
import NotAuthorized from "./components/pages/NotAuthorized.jsx";
import UsersPage from "./components/pages/UsersPage.jsx";
import TeachersPage from "./components/pages/TeacherPage.jsx";
import WelcomePage from "./components/pages/WelcomePage.jsx";
import StudentForm from "./components/Estudiantes/StudentForm.jsx";
import StudentRegistrationPage from "./components/pages/StudentRegistrationPage.jsx";
import GradesPage from "./components/pages/GradesPage.jsx";
import GuardianForm from "./components/Apoderados/GuardianForm.jsx";
import EnrollmentForm from "./components/Enrollments/EnrollmentForm.jsx";
import EnrollmentsPage from "./components/pages/EnrollmentsPage.jsx";
import AcademicYearPage from "./components/pages/AcademicYearPage.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ir directo al dashboard mientras pruebas */}
        
        <Route path="/login" element={<LoginForm />} />

        <Route path="/welcome" element={<WelcomePage />} />

        {/* SIN ProtectedRoute, solo para ver el dashboard */}
        {/* Layout persistente con sidebar */}
        <Route element={<MainLayout />}>
          <Route element={<RequireRoles allowed={["admin", "docente"]} />}>
            <Route path="/dashboard" element={<div className="p-8">Bienvenido al panel principal</div>} />
            <Route path="/attendance" element={<div className="p-8">UI Asistencia</div>} />
            <Route path="/students" element={<StudentForm />} />
            <Route path="/students/register" element={<StudentRegistrationPage />} />
            <Route path="/guardians" element={<GuardianForm />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/enrollments" element={<EnrollmentsPage />} />
            <Route path="/academic-year" element={<AcademicYearPage />} />
          </Route>
          <Route element={<RequireRoles allowed={["admin", "padre"]} />}>
            <Route path="/payments" element={<div className="p-8">UI Pagos</div>} />
          </Route>
          <Route element={<RequireRoles allowed={["admin"]} />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
          </Route>
        </Route>

        {/* Ruta protegida para Asistencia */}
        <Route element={<RequireRoles allowed={["admin", "docente"]} />}>
          <Route path="/attendance" element={<div className="p-8">UI Asistencia</div>} />
        </Route>

        {/* Ruta protegida para Pagos */}
        <Route element={<RequireRoles allowed={["admin", "padre"]} />}>
          <Route path="/payments" element={<div className="p-8">UI Pagos</div>} />
        </Route>

        {/* Ruta protegida para Estudiantes */}
        <Route element={<RequireRoles allowed={["admin", "docente"]} />}>
          <Route path="/students" element={<StudentForm />} />
        </Route>


        {/* Ruta protegida para Padres/Apoderados */}
        <Route element={<RequireRoles allowed={["admin", "docente"]} />}>
          <Route path="/guardians" element={<GuardianForm />} />
        </Route>

        {/* Ruta protegida para Grados */}
        <Route element={<RequireRoles allowed={["admin", "docente"]} />}>
          <Route path="/grades" element={<GradesPage />} />
        </Route>

        {/* Ruta protegida para Usuarios */}
        <Route element={<RequireRoles allowed={["admin"]} />}>
          <Route path="/users" element={<UsersPage />} />
        </Route>

        {/* Página de acceso no autorizado */}
        <Route path="/403" element={<NotAuthorized />} />
        {/* Ruta protegida para docentes */}
        <Route element={<RequireRoles allowed={["admin"]} />}>
          <Route path="/teachers" element={<TeachersPage />} />
        </Route>

        {/* Ruta protegida para Matrícula */}
        <Route element={<RequireRoles allowed={["admin", "docente"]} />}>
          <Route path="/enrollments" element={<EnrollmentsPage />} />
        </Route>

        {/* Redirigir cualquier ruta no existente al dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

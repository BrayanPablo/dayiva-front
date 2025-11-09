import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/Login/LoginForm.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import RequireRoles from "./router/RequireRoles.jsx";
import ProtectedRoute from "./router/ProtectedRoute.jsx";
import NotAuthorized from "./components/pages/NotAuthorized.jsx";
import UsersPage from "./components/pages/UsersPage.jsx";
import TeachersPage from "./components/pages/TeacherPage.jsx";
import WelcomePage from "./components/pages/WelcomePage.jsx";
import StudentForm from "./components/Estudiantes/StudentForm.jsx";
import StudentRegistrationPage from "./components/pages/StudentRegistrationPage.jsx";
import StudentDetailsPage from "./components/pages/StudentDetailsPage.jsx";
import StudentPaymentHistoryPage from "./components/pages/StudentPaymentHistoryPage.jsx";
import GradesPage from "./components/pages/GradesPage.jsx";
import GuardianForm from "./components/Apoderados/GuardianForm.jsx";
import EnrollmentForm from "./components/Enrollments/EnrollmentForm.jsx";
import EnrollmentsPage from "./components/pages/EnrollmentsPage.jsx";
import AcademicYearPage from "./components/pages/AcademicYearPage.jsx";
import ReportsPage from "./components/pages/ReportsPage.jsx";
import HomePage from "./components/pages/HomePage.jsx";
import PaymentsPage from "./components/pages/PaymentsPage.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública: Login */}
        <Route path="/login" element={<LoginForm />} />

        {/* Protegidas: requieren estar autenticado */}
        <Route element={<ProtectedRoute />}>
          {/* Bienvenida: SIN sidebar, intermedia entre login y dashboard */}
          <Route path="/welcome" element={<WelcomePage />} />
          {/* Layout persistente con sidebar */}
          <Route element={<MainLayout />}>
            {/* Acceso para admin y docente */}
            <Route element={<RequireRoles allowed={["admin", "docente"]} />}>
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/students" element={<StudentForm />} />
              <Route path="/students/register" element={<StudentRegistrationPage />} />
              <Route path="/students/:id" element={<StudentDetailsPage />} />
              <Route path="/students/:id/payments" element={<StudentPaymentHistoryPage />} />
              <Route path="/guardians" element={<GuardianForm />} />
              <Route path="/grades" element={<GradesPage />} />
              <Route path="/enrollments" element={<EnrollmentsPage />} />
              <Route path="/academic-year" element={<AcademicYearPage />} />
            </Route>
            {/* Acceso para admin y padre */}
            <Route element={<RequireRoles allowed={["admin", "padre"]} />}>
              <Route path="/payments" element={<PaymentsPage />} />
            </Route>
            {/* Solo admin */}
            <Route element={<RequireRoles allowed={["admin"]} />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/teachers" element={<TeachersPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Página de acceso no autorizado */}
        <Route path="/403" element={<NotAuthorized />} />

        {/* Redirigir cualquier ruta no existente al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

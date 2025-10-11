// src/components/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  CalendarDaysIcon,
  BanknotesIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  ClipboardIcon
} from "@heroicons/react/24/outline";

const FEATURES = [
  { key: "attendance", label: "Asistencia", path: "/attendance", roles: ["ADMIN", "DOCENTE"], icon: CalendarDaysIcon },
  { key: "payments", label: "Pagos", path: "/payments", roles: ["ADMIN", "PADRE"], icon: BanknotesIcon },
  { key: "students", label: "Estudiantes", path: "/students", roles: ["ADMIN", "DOCENTE"], icon: UserGroupIcon },
  { key: "academic_year", label: "Año Académico", path: "/academic-year", roles: ["ADMIN", "DOCENTE"], icon: CalendarDaysIcon },
  { key: "guardians", label: "Padres", path: "/guardians", roles: ["ADMIN", "DOCENTE"], icon: UserGroupIcon },
  { key: "grades", label: "Grados", path: "/grades", roles: ["ADMIN", "DOCENTE"], icon: AcademicCapIcon },
  { key: "enrollments", label: "Matrícula", path: "/enrollments", roles: ["ADMIN", "DOCENTE"], icon: ClipboardDocumentCheckIcon },
  { key: "reports", label: "Reportes", path: "/reports", roles: ["ADMIN"], icon: ClipboardDocumentCheckIcon },
  { key: "users", label: "Usuarios", path: "/users", roles: ["ADMIN"], icon: UserGroupIcon },
  { key: "teachers", label: "Docentes", path: "/teachers", roles: ["ADMIN"], icon: AcademicCapIcon },
];


export default function Dashboard() {
  const auth = useAuth();
  const { role, user, logout } = auth;
  const roleToUse = role || "ADMIN";
  const visible = FEATURES.filter(f => f.roles.map(r => r.toLowerCase()).includes(roleToUse.toLowerCase()));

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col py-6 px-4 min-h-screen shadow-xl">
        <div className="mb-8 flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-2" />
          <h2 className="text-lg font-bold tracking-wide">I.E DAYIVA SCHOOL</h2>
          <span className="text-xs text-blue-200">Panel principal</span>
        </div>
        <nav className="flex-1">
          {visible.map(({ key, label, path, icon: Icon }) => (
            <Link
              key={key}
              to={path}
              className="flex items-center gap-3 mb-2 px-4 py-3 rounded-lg transition-colors duration-200 bg-blue-900 hover:bg-yellow-400 hover:text-blue-900 focus:bg-yellow-400 focus:text-blue-900 active:bg-yellow-400 active:text-blue-900"
              style={{ fontWeight: 500 }}
            >
              <Icon className="w-6 h-6" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-8 text-xs text-blue-200">
          Rol: <span className="font-bold text-white">{roleToUse}</span><br />
          {user?.email ?? "demo@dayiva.pe"}
        </div>
        <button
          onClick={() => {
            logout();
            window.location.replace("/login");
          }}
          className="mt-6 px-4 py-2 rounded-lg bg-blue-800 hover:bg-yellow-400 hover:text-blue-900 text-white font-semibold transition-colors duration-200"
        >
          Salir
        </button>
      </aside>
      {/* El contenido principal se renderiza vía Outlet en MainLayout */}
    </div>
  );
}

// src/components/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import ThemeSwitcher from "../ui/ThemeSwitcher.jsx";
import {
  CalendarDaysIcon,
  BanknotesIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  ClipboardIcon
} from "@heroicons/react/24/outline";

const FEATURES = [
  { key: "home", label: "Home", path: "/dashboard", roles: ["ADMIN", "DOCENTE", "PADRE"], icon: ClipboardIcon },
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
  const roleToUse = role;
  const visible = roleToUse
    ? FEATURES.filter(f => f.roles.map(r => r.toLowerCase()).includes(roleToUse.toLowerCase()))
    : [];
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <>
      {/* Botón hamburguesa para móviles */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-primary btn-sm"
        aria-label="Toggle sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay para móviles cuando el sidebar está abierto */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar responsive: oculto en móviles, visible en desktop */}
      <aside className={`
        fixed left-0 top-0 h-screen text-base-content flex flex-col py-4 px-4 shadow-xl gap-3 
        bg-gradient-to-b from-yellow-200/60 via-yellow-100/50 to-blue-200/60 
        dark:from-yellow-700/30 dark:via-yellow-800/20 dark:to-blue-900/30
        w-72 z-40
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="mb-4 flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-2" />
          <h2 className="text-lg font-bold tracking-wide drop-shadow">I.E DAYIVA SCHOOL</h2>
          <span className="text-xs text-base-content/70">Panel principal</span>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="menu menu-compact rounded-lg bg-transparent border-0 p-1">
            {visible.map(({ key, label, path, icon: Icon }) => (
              <li key={key} className="m-0">
                <Link
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className="group rounded-lg px-2 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-500/25 via-blue-500/10 to-yellow-400/25 hover:from-blue-500/35 hover:via-blue-500/15 hover:to-yellow-400/35 border border-blue-300/40 shadow-sm transition-colors"
                >
                  <Icon className="w-5 h-5 text-blue-700 group-hover:text-blue-800" />
                  <span className="font-semibold text-blue-800 group-hover:text-blue-900">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto mb-6">
          <div className="text-xs text-base-content/70">
            Rol: <span className="font-bold text-base-content">{roleToUse ?? "—"}</span><br />
            {user?.email ?? ""}
          </div>
          <div className="mt-2">
            <ThemeSwitcher />
          </div>
          <button
            onClick={() => {
              logout();
              window.location.replace("/login");
            }}
            className="mt-3 btn btn-primary w-full"
          >
            Salir
          </button>
        </div>
      </aside>
    </>
  );
}

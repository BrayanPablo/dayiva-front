import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TeacherForm from "../Docentes/TeacherForm";
import TeacherList from "../Docentes/TeacherList"; // 👈 debes crear este componente similar a UserList

const TeachersPage = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[TEACHERSPAGE] isAuthenticated:", isAuthenticated, "role:", role);
    if (!isAuthenticated || role?.toLowerCase() !== "admin") {
      navigate("/403");
    }
  }, [isAuthenticated, role, navigate]);

  if (!isAuthenticated || role?.toLowerCase() !== "admin") {
    return null;
  }

  console.log("[TEACHERSPAGE] Render", { isAuthenticated, role });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-start justify-start pt-8 w-full">
      <header className="bg-white border-b w-full">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Gestionar Docentes</h1>
        </div>
      </header>

      <main className="w-full px-6 py-6">
        <TeacherList />
      </main>
    </div>
  );
};

export default TeachersPage;

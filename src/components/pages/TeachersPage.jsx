import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TeacherList from "../Docentes/TeacherList";

const TeachersPage = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || role?.toLowerCase() !== "admin") {
      navigate("/403");
    }
  }, [isAuthenticated, role, navigate]);

  if (!isAuthenticated || role?.toLowerCase() !== "admin") {
    return null;
  }

  return (
    <div className="w-full">
      <TeacherList />
    </div>
  );
};

export default TeachersPage;



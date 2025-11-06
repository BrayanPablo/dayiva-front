import Dashboard from "../pages/Dashboard.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "../ui/LoadingScreen.jsx";

export default function MainLayout() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mostrar loading cuando cambie la ruta
    setIsLoading(true);
    
    // Simular tiempo de carga (puedes ajustar este tiempo)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 segundo

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-base-200">
      <Dashboard />
      <main className="lg:ml-72 px-4 md:px-6 lg:px-8 py-6 pt-16 lg:pt-6 relative">
        {isLoading && <LoadingScreen />}
        <Outlet />
      </main>
    </div>
  );
}

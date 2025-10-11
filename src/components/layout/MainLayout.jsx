import Dashboard from "../pages/Dashboard.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Dashboard />
      <main className="flex-1 px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
}

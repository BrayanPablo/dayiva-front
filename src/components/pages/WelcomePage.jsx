import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <div className="bg-base-100 rounded-2xl shadow-lg p-8 max-w-xl w-full text-center">
        <img src="/dayivianos.png" alt="Fachada IEP Dayiva" className="mx-auto mb-6 rounded-lg shadow" style={{ maxHeight: 220 }} />
        <div className="flex items-center justify-center mb-2 gap-2">
          <h1 className="text-3xl font-bold text-blue-700">¡Bienvenido</h1>
          {user?.first_name || user?.name || user?.username || user?.email ? (
            <span className="text-3xl font-bold text-blue-700">
              {user?.first_name || user?.name || user?.username || user?.email}
            </span>
          ) : null}
          <h1 className="text-3xl font-bold text-blue-700">!</h1>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-base-content">IEP Dayiva School</h2>
        <p className="mb-4 text-lg text-base-content/70">¡Bienvenidos a la IEP Dayiva School!</p>
        <div className="mb-6 text-left">
          <h3 className="font-bold text-blue-600 mb-1">Misión</h3>
          <p className="mb-3 text-base-content/80">
            Ser una institución educativa de calidad y excelencia, líder en la formación integral del niño, con habilidades, destrezas y actitudes con sólidos valores como resultado de educación de calidad, con proyección a la comunidad, capaces de analizar, proponer y enfrentar los retos del mundo moderno.
          </p>
          <h3 className="font-bold text-blue-600 mb-1">Visión</h3>
          <p className="text-base-content/80">
            Ser una institución educativa que brinda a nuestros niños una formación integral, innovadora y que desarrolle capacidades fundamentales individuales y grupales, desarrollando su autoestima y conciencia social basada en el respeto, honestidad y responsabilidad garantizando una mejor calidad de vida que les permita enfrentar los desafíos del mundo competitivo.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/dashboard")}
          >
            Siguiente
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
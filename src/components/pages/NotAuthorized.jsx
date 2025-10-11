export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Acceso restringido</h2>
        <p className="text-gray-600">No tienes permisos para ver esta sección.</p>
      </div>
    </div>
  );
}

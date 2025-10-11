import React from "react";

const ListaAños = ({ items, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl shadow-lg border-2 border-yellow-400 bg-white w-full py-4">
      <table className="min-w-full table-auto text-base md:text-lg">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-3 text-left text-blue-700 font-semibold">Año</th>
            <th className="px-4 py-3 text-left text-blue-700 font-semibold">Inicio</th>
            <th className="px-4 py-3 text-left text-blue-700 font-semibold">Fin</th>
            <th className="px-4 py-3 text-left text-blue-700 font-semibold">Estado</th>
            <th className="px-4 py-3 text-center text-blue-700 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No hay años registrados</td>
            </tr>
          ) : (
            items.map((y) => (
              <tr key={y.id} className="border-t hover:bg-yellow-50 transition">
                <td className="px-4 py-2">{y.year}</td>
                <td className="px-4 py-2">{new Date(y.start_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(y.end_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <span className={`text-sm px-3 py-1 rounded-full ${y.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{y.status}</span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center gap-3">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 py-2 rounded shadow font-bold text-lg" onClick={() => onEdit?.(y)}>✏️</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow font-bold text-lg" onClick={() => onDelete?.(y)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaAños;



import React, { useState, useMemo } from 'react';
import Button from './Button';

const DataTable = ({
  data = [],
  columns = [],
  searchFields = [],
  itemsPerPage = 10,
  onEdit,
  onDelete,
  onView,
  onDownload,
  loading = false,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filtrar datos
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, searchFields]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Paginación
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Manejar ordenamiento
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Manejar cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Resetear búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className={`card bg-base-100 shadow ${className}`}>
      {/* Barra de búsqueda */}
      {searchFields.length > 0 && (
        <div className="p-4 border-b">
          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </label>
        </div>
      )}

      {/* Tabla - Responsive con scroll horizontal en móviles */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="table table-zebra w-full text-sm sm:text-base">
          <thead className="hidden sm:table-header-group">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm">{column.label}</span>
                    {column.sortable && (
                      <span className="text-xs">
                        {sortField === column.key ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : (
                          '↕'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onView || onDownload) && (
                <th className="whitespace-nowrap">
                  <span className="text-xs sm:text-sm">Acciones</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={item.id || index} className="hover">
                {columns.map((column) => (
                  <td key={column.key} className="text-xs sm:text-sm">
                    <div className="sm:hidden font-semibold mb-1 text-gray-600">{column.label}:</div>
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onView || onDownload) && (
                  <td>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {onView && (
                        <Button
                          size="small"
                          variant="outline"
                          onClick={() => onView(item)}
                          className="text-xs sm:text-sm px-2 py-1"
                        >
                          Ver
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          size="small"
                          variant="primary"
                          onClick={() => onEdit(item)}
                          className="text-xs sm:text-sm px-2 py-1"
                        >
                          Editar
                        </Button>
                      )}
                      {onDownload && (
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => onDownload(item)}
                          className="text-xs sm:text-sm px-2 py-1"
                        >
                          📄 PDF
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="small"
                          variant="danger"
                          onClick={() => onDelete(item)}
                          className="text-xs sm:text-sm px-2 py-1"
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación - Responsive */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-xs sm:text-sm opacity-70 text-center sm:text-left">
            Mostrando {startIndex + 1} a {Math.min(endIndex, sortedData.length)} de {sortedData.length} resultados
          </div>
          <div className="join flex-wrap justify-center">
            <Button
              size="small"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="join-item text-xs sm:text-sm"
            >
              «
            </Button>
            {/* En móviles, mostrar menos páginas */}
            <div className="hidden sm:flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  size="small"
                  variant={page === currentPage ? 'primary' : 'outline'}
                  onClick={() => handlePageChange(page)}
                  className="join-item text-xs sm:text-sm"
                >
                  {page}
                </Button>
              ))}
            </div>
            {/* En móviles, mostrar solo página actual y total */}
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-xs">Página {currentPage} de {totalPages}</span>
            </div>
            <Button
              size="small"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="join-item text-xs sm:text-sm"
            >
              »
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

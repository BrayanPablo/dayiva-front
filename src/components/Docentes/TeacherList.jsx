import React, { useEffect, useState } from "react";
import TeacherForm from "./TeacherForm";
import DataTable from "../shared/DataTable";
import Button from "../shared/Button";
import { apiGet, apiDelete } from "../../utils/api";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchTeachers = async () => {
    try {
      const res = await apiGet("/api/teachers");
      if (!res.ok) throw new Error("Error al obtener docentes");
      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este docente?")) return;
    try {
      const res = await apiDelete(`/api/teachers/${id}`);
      if (!res.ok) throw new Error("Error al eliminar docente");
      setTeachers(teachers.filter((t) => t.teacher_id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (teacher) => {
    setEditTeacher(teacher);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  return (
    <div className="w-full max-w-full px-3 md:px-6 lg:px-8">
      <div className="w-full">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-0">Lista de Docentes</h2>
          <Button
            variant="primary"
            size="large"
            onClick={handleAdd}
            className="px-6"
          >
            + Agregar Docente
          </Button>
        </div>
        {error && (
          <div role="alert" className="alert alert-warning mb-4">
            <span>{error}</span>
          </div>
        )}
        {/* Configuración de columnas para DataTable */}
        {(() => {
          const columns = [
            {
              key: 'document_id',
              label: 'Documento',
              sortable: true
            },
            {
              key: 'first_name',
              label: 'Nombres',
              sortable: true
            },
            {
              key: 'last_name',
              label: 'Apellidos',
              sortable: true
            },
            {
              key: 'birth_date',
              label: 'Nacimiento',
              sortable: true,
              render: (value) => value ? new Date(value).toLocaleDateString() : ''
            },
            {
              key: 'gender',
              label: 'Género',
              sortable: true
            },
            {
              key: 'city',
              label: 'Ciudad',
              sortable: true
            },
            {
              key: 'email',
              label: 'Email',
              sortable: true
            },
            {
              key: 'phone_number',
              label: 'Teléfono',
              sortable: true
            },
            {
              key: 'status',
              label: 'Estado',
              sortable: true,
              render: (value) => (
                <span className={`text-sm px-3 py-1 rounded-full ${
                  value === 'active' ? 'bg-green-100 text-green-700' : 
                  value === 'inactive' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {value}
                </span>
              )
            }
          ];

          const searchFields = ['first_name', 'last_name', 'document_id', 'email'];

          return (
            <div className="w-full">
              <DataTable
                data={teachers}
                columns={columns}
                searchFields={searchFields}
                itemsPerPage={10}
                onEdit={handleEdit}
                onDelete={(teacher) => handleDelete(teacher.teacher_id)}
                loading={false}
                className=""
              />
            </div>
          );
        })()}
      </div>
      {/* Modal de edición */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-base-100 rounded-box shadow-xl p-6 w-full max-w-md relative">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => { setShowEditModal(false); setEditTeacher(null); }}
              title="Cerrar"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Editar Docente</h2>
            <TeacherForm
              teacher={editTeacher}
              isEdit
              onSuccess={() => {
                setShowEditModal(false);
                setEditTeacher(null);
                fetchTeachers();
              }}
            />
          </div>
        </div>
      )}
      {/* Modal de agregar */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-base-100 rounded-box shadow-xl p-6 w-full max-w-md relative">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => { setShowAddModal(false); }}
              title="Cerrar"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Agregar Docente</h2>
            <TeacherForm
              onSuccess={() => {
                setShowAddModal(false);
                fetchTeachers();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherList;
import React from 'react';
import { useForm, validationRules } from '../../hooks/useForm';
import Button from '../shared/Button';
import Input from '../shared/Input';

const ExampleForm = () => {
  // Configuración inicial del formulario
  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dni: ''
  };

  // Reglas de validación
  const validationRules = {
    first_name: [validationRules.required('El nombre es requerido')],
    last_name: [validationRules.required('El apellido es requerido')],
    email: [
      validationRules.required('El email es requerido'),
      validationRules.email('Email inválido')
    ],
    phone: [
      validationRules.required('El teléfono es requerido'),
      validationRules.phone('Teléfono inválido')
    ],
    dni: [
      validationRules.required('El DNI es requerido'),
      validationRules.dni('DNI inválido')
    ]
  };

  // Usar el hook useForm
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    isValid
  } = useForm(initialValues, validationRules);

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Datos válidos:', values);
      // Aquí enviarías los datos al servidor
      alert('Formulario enviado correctamente');
    } else {
      console.log('Errores de validación:', errors);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Formulario de Ejemplo</h2>
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre"
          name="first_name"
          value={values.first_name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.first_name && errors.first_name}
          required
        />

        <Input
          label="Apellido"
          name="last_name"
          value={values.last_name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.last_name && errors.last_name}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          required
        />

        <Input
          label="Teléfono"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phone && errors.phone}
          required
        />

        <Input
          label="DNI"
          name="dni"
          value={values.dni}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.dni && errors.dni}
          required
        />

        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={resetForm}
            className="flex-1"
          >
            Limpiar
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid}
            className="flex-1"
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExampleForm;

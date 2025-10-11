import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Función para manejar cambios en inputs
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Función para manejar blur (cuando el usuario sale del campo)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar campo cuando el usuario sale
    validateField(name, values[name]);
  }, [values]);

  // Función para validar un campo específico
  const validateField = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return true;

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error
        }));
        return false;
      }
    }

    // Limpiar error si la validación pasa
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    return true;
  }, [values, validationRules]);

  // Función para validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const fieldValue = values[fieldName];
      const rules = validationRules[fieldName];

      for (const rule of rules) {
        const error = rule(fieldValue, values);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
          break;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Función para establecer valores
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Función para establecer múltiples valores
  const setValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    resetForm,
    setValue,
    setValues,
    isValid: Object.keys(errors).length === 0
  };
};

// Reglas de validación comunes
export const validationRules = {
  required: (message = 'Este campo es requerido') => (value) => {
    if (!value || value.toString().trim() === '') {
      return message;
    }
    return null;
  },

  email: (message = 'Email inválido') => (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return message;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `Mínimo ${min} caracteres`;
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `Máximo ${max} caracteres`;
    }
    return null;
  },

  pattern: (regex, message) => (value) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return null;
  },

  dni: (message = 'DNI inválido') => (value) => {
    if (value && !/^\d{8}$/.test(value)) {
      return message;
    }
    return null;
  },

  phone: (message = 'Teléfono inválido') => (value) => {
    if (value && !/^\d{9}$/.test(value)) {
      return message;
    }
    return null;
  }
};

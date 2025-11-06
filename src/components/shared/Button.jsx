import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  // Variantes de estilo (DaisyUI)
  const variants = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    success: 'btn btn-success',
    danger: 'btn btn-error',
    outline: 'btn btn-outline',
    ghost: 'btn btn-ghost'
  };

  // Tamaños
  const sizes = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg',
    xl: 'btn-xl'
  };

  // Clases base
  const baseClasses = '';
  
  // Clases específicas
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.medium;
  
  // Clases finales
  const finalClasses = `${variantClasses} ${sizeClasses} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={finalClasses}
      {...props}
    >
      {loading ? <span className="loading loading-spinner loading-sm"></span> : children}
    </button>
  );
};

export default Button;

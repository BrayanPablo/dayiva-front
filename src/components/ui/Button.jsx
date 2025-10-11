// src/components/ui/Button.jsx
import React from "react";

const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      {children}
    </button>
  );
};

export default Button; // Esto exporta el componente como default

import React from 'react';

const Button = ({ type, label }) => {
  return (
    <button
      type={type}
      className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {label}
    </button>
  );
};

export default Button;

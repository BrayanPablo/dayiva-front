// src/components/LoginMessage.jsx

import React from 'react';

const LoginMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="login-message">
      {message}
    </div>
  );
};

export default LoginMessage;

// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import LoginMessage from '../components/LoginMessage';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Redirigir al Dashboard después de un login exitoso
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <h2>Iniciar Sesión</h2>
      <LoginMessage message={message} />
      <LoginForm setMessage={setMessage} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;

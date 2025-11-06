import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animación de libros apilados */}
        <div className="relative mb-8 h-20 flex items-end justify-center">
          {/* Libro 1 - Azul */}
          <div className="w-10 h-14 bg-gradient-to-b from-blue-500 to-blue-600 rounded-sm shadow-lg animate-bounce mx-1" style={{ animationDelay: '0s', animationDuration: '1.2s' }}>
            <div className="w-full h-0.5 bg-blue-700 mt-2"></div>
            <div className="w-full h-0.5 bg-blue-700 mt-1"></div>
            <div className="w-full h-0.5 bg-blue-700 mt-1"></div>
          </div>
          
          {/* Libro 2 - Verde */}
          <div className="w-10 h-14 bg-gradient-to-b from-green-500 to-green-600 rounded-sm shadow-lg animate-bounce mx-1" style={{ animationDelay: '0.2s', animationDuration: '1.2s' }}>
            <div className="w-full h-0.5 bg-green-700 mt-2"></div>
            <div className="w-full h-0.5 bg-green-700 mt-1"></div>
            <div className="w-full h-0.5 bg-green-700 mt-1"></div>
          </div>
          
          {/* Libro 3 - Púrpura */}
          <div className="w-10 h-14 bg-gradient-to-b from-purple-500 to-purple-600 rounded-sm shadow-lg animate-bounce mx-1" style={{ animationDelay: '0.4s', animationDuration: '1.2s' }}>
            <div className="w-full h-0.5 bg-purple-700 mt-2"></div>
            <div className="w-full h-0.5 bg-purple-700 mt-1"></div>
            <div className="w-full h-0.5 bg-purple-700 mt-1"></div>
          </div>
          
          {/* Libro 4 - Amarillo */}
          <div className="w-10 h-14 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-sm shadow-lg animate-bounce mx-1" style={{ animationDelay: '0.6s', animationDuration: '1.2s' }}>
            <div className="w-full h-0.5 bg-yellow-700 mt-2"></div>
            <div className="w-full h-0.5 bg-yellow-700 mt-1"></div>
            <div className="w-full h-0.5 bg-yellow-700 mt-1"></div>
          </div>
        </div>
        
        {/* Texto de carga */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-800">Cargando...</h3>
          
          
          
          {/* Spinner simple */}
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        
        {/* Elementos decorativos sutiles */}
        <div className="absolute top-8 left-8 text-blue-300 opacity-40">
          <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <div className="absolute top-12 right-8 text-green-300 opacity-40">
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div className="absolute bottom-16 left-12 text-purple-300 opacity-40">
          <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

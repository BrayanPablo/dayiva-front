import React, { createContext, useContext, useCallback, useState, useMemo, useEffect } from "react";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((opts) => {
    const id = Math.random().toString(36).slice(2);
    const toast = {
      id,
      title: opts.title || "",
      message: opts.message || "",
      type: opts.type || "success", // success | error | info | warning
      duration: opts.duration ?? 3000,
    };
    setToasts((prev) => [...prev, toast]);
    if (toast.duration > 0) {
      setTimeout(() => remove(id), toast.duration);
    }
    return id;
  }, [remove]);

  const value = useMemo(() => ({ show, remove }), [show, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id}
               className={`min-w-[260px] max-w-[360px] rounded-md shadow-lg border px-4 py-3 text-sm bg-white ${
                 t.type === 'success' ? 'border-green-500' : t.type === 'error' ? 'border-red-500' : 'border-blue-500'
               }`}
          >
            <div className="flex items-start gap-2">
              <div className={`mt-0.5 text-lg ${t.type === 'success' ? 'text-green-600' : t.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>✔</div>
              <div className="flex-1">
                {t.title && <div className="font-semibold uppercase tracking-wide text-gray-800">{t.title}</div>}
                {t.message && <div className="text-gray-700">{t.message}</div>}
              </div>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => remove(t.id)}>×</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;



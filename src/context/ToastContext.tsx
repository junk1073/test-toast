import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { Toast } from '../types/types';

type ToastContextValue = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (newToast: Omit<Toast, 'id'>) => {
    setToasts((prevToasts) => {
      // ищем тост с тем же текстом и типом
      const existing = prevToasts.find(
        (t) => t.message === newToast.message && t.type === newToast.type
      );

      if (existing) {
        // дедупликация: обновляем duration
        return prevToasts.map((t) =>
          t.id === existing.id ? { ...t, duration: newToast.duration } : t
        );
      }

      // если нет — создаём новый
      return [
        ...prevToasts,
        {
          ...newToast,
          id: crypto.randomUUID(), // уникальный id
        },
      ];
    });
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};

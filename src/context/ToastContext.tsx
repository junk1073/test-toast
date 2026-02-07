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
      // ✅ дедупликация: ищем тост с тем же текстом и типом
      const existing = prevToasts.find(
        (t) => t.message === newToast.message && t.type === newToast.type
      );

      if (existing) {
        // ✅ если есть такой тост — сбрасываем таймер (reset)
        return prevToasts.map((t) =>
          t.id === existing.id
            ? { ...t, duration: newToast.duration, reset: true } // ✅ добавлен флаг reset
            : t
        );
      }

      // ✅ если нет — создаём новый тост
      return [
        ...prevToasts,
        {
          ...newToast,
          id: crypto.randomUUID(), // ✅ уникальный id
        },
      ];
    });
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id)); // ✅ удаление тоста
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// ✅ хук для использования контекста
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};


import React, { useEffect, useRef, useState } from 'react';
import type { Toast } from '../types/types';

interface ToastItemProps {
  toast: Toast & { reset?: boolean };
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const intervalRef = useRef<number | null>(null);
  const lastStartRef = useRef<number>(Date.now());
  const [visible, setVisible] = useState(false); // ✅ добавлено для анимации появления/исчезновения

  const duration = toast.duration ?? 3000;

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = () => {
    if (intervalRef.current) return;
    lastStartRef.current = Date.now();

    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - lastStartRef.current;
      lastStartRef.current = Date.now();

      // ✅ умный таймер с паузой и сбросом
      (toast as any)._remaining = ((toast as any)._remaining ?? duration) - elapsed;

      if ((toast as any)._remaining <= 0) {
        clearTimer();
        setVisible(false); // ✅ плавное исчезновение
        setTimeout(() => onRemove(toast.id), 300); // ✅ ждём конца анимации
      }
    }, 50);
  };

  const pauseTimer = () => {
    clearTimer(); // ✅ пауза при наведении мыши
  };

  useEffect(() => {
    setVisible(true); // ✅ анимация появления
    (toast as any)._remaining = duration;
    startTimer();
    return clearTimer;
  }, []);

  useEffect(() => {
    if (toast.reset) {
      (toast as any)._remaining = duration;
      clearTimer();
      startTimer(); // ✅ сброс таймера при дедупликации
    }
  }, [toast]);

  return (
    <div
      className={`toast toast-${toast.type} ${visible ? 'toast-show' : 'toast-hide'}`} // ✅ добавлено для анимации
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
      <span>{toast.message}</span>
      <button onClick={() => {
        setVisible(false);
        setTimeout(() => onRemove(toast.id), 300); // ✅ плавное закрытие по кнопке
      }}>x</button>
    </div>
  );
};

export default ToastItem;





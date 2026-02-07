import React, { useEffect, useRef, useState } from 'react';
import type { Toast } from '../types/types';

interface ToastItemProps {
  toast: Toast & { reset?: boolean };
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const intervalRef = useRef<number | null>(null);
  const lastStartRef = useRef<number>(Date.now());
  const [visible, setVisible] = useState(false); // для анимации появления/исчезновения

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

      // уменьшаем duration
      (toast as any)._remaining = ((toast as any)._remaining ?? duration) - elapsed;

      if ((toast as any)._remaining <= 0) {
        clearTimer();
        // запуск анимации исчезновения
        setVisible(false);
        setTimeout(() => onRemove(toast.id), 300); // ждём конца анимации
      }
    }, 50);
  };

  const pauseTimer = () => {
    clearTimer();
  };

  useEffect(() => {
    // показ тоста с анимацией
    setVisible(true);
    (toast as any)._remaining = duration;
    startTimer();
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // сброс таймера при повторном тосте
  useEffect(() => {
    if (toast.reset) {
      (toast as any)._remaining = duration;
      clearTimer();
      startTimer();
    }
  }, [toast]);

  return (
    <div
      className={`toast toast-${toast.type} ${visible ? 'toast-show' : 'toast-hide'}`}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
      <span>{toast.message}</span>
      <button onClick={() => {
        setVisible(false);
        setTimeout(() => onRemove(toast.id), 300);
      }}>x</button>
    </div>
  );
};

export default ToastItem;




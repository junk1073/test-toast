import React, { useEffect, useRef, useState } from 'react';
import type { Toast } from '../types/types';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [remaining, setRemaining] = useState(toast.duration ?? 3000); // оставшееся время
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number>(Date.now());

  // функция запуска таймера
  const startTimer = () => {
    if (timerRef.current) return; // таймер уже запущен

    startRef.current = Date.now();
    timerRef.current = window.setTimeout(() => {
      onRemove(toast.id);
    }, remaining);
  };

  // функция паузы таймера
  const pauseTimer = () => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
    const elapsed = Date.now() - startRef.current;
    setRemaining((prev) => prev - elapsed);
  };

  // запускаем таймер при монтировании
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`toast toast-${toast.type}`}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
      <span>{toast.message}</span>
      <button onClick={() => onRemove(toast.id)}>x</button>
    </div>
  );
};

export default ToastItem;
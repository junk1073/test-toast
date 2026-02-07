import React, { useEffect, useRef, useState } from 'react';
import type { Toast } from '../types/types';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [remaining, setRemaining] = useState(toast.duration ?? 3000);
  const intervalRef = useRef<number | null>(null);
  const lastStartRef = useRef<number>(Date.now());

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = () => {
    if (intervalRef.current) return; // уже запущен
    lastStartRef.current = Date.now();

    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - lastStartRef.current;
      setRemaining((prev) => {
        const next = prev - elapsed;
        if (next <= 0) {
          clearTimer();
          onRemove(toast.id);
          return 0;
        }
        lastStartRef.current = Date.now();
        return next;
      });
    }, 50);
  };

  const pauseTimer = () => {
    clearTimer();
    const elapsed = Date.now() - lastStartRef.current;
    setRemaining((prev) => prev - elapsed);
  };

  useEffect(() => {
    startTimer();
    return clearTimer;
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

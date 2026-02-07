// ✅ типы для тостов
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// ✅ интерфейс тоста
export interface Toast {
  id: string;         // уникальный id тоста
  message: string;    // текст тоста
  type: ToastType;    // тип (для цвета/стилей)
  duration: number;   // время отображения в миллисекундах
}



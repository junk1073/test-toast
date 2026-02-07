import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { ToastProvider, useToast } from '../context/ToastContext';
import ToastList from './ToastList';

// Вспомогательный компонент для тестов
const TestComponent = () => {
    const { addToast } = useToast();
    return (
        <div>
            <button
                onClick={() => addToast({ message: 'Успех!', type: 'success', duration: 300 })}
            >
                Add Toast
            </button>
            <ToastList />
        </div>
    );
};

describe('Toast System', () => {
    it('показывает тост и таймер работает корректно', async () => {
        vi.useFakeTimers(); // используем fake timers для контроля времени

        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        // добавляем тост
        fireEvent.click(screen.getByText('Add Toast'));
        expect(screen.getByText('Успех!')).toBeInTheDocument();

        // таймер еще не истек
        vi.advanceTimersByTime(200);
        expect(screen.getByText('Успех!')).toBeInTheDocument();

        // таймер истек
        vi.advanceTimersByTime(200);
        expect(screen.queryByText('Успех!')).toBeNull();

        vi.useRealTimers();
    });

    it('при наведении курсора таймер ставится на паузу', async () => {
        vi.useFakeTimers();

        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        fireEvent.click(screen.getByText('Add Toast'));

        const toast = screen.getByText('Успех!').parentElement!;
        fireEvent.mouseEnter(toast); // пауза таймера

        vi.advanceTimersByTime(1000); // прошло больше, чем duration
        expect(screen.getByText('Успех!')).toBeInTheDocument(); // тост еще есть

        fireEvent.mouseLeave(toast); // продолжаем таймер
        vi.advanceTimersByTime(300);
        expect(screen.queryByText('Успех!')).toBeNull();

        vi.useRealTimers();
    });
});


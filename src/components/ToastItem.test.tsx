import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { ToastProvider, useToast } from '../context/ToastContext';
import ToastList from './ToastList';

// ✅ вспомогательный тестовый компонент для проверки работы тостов
const TestComponent = () => {
    const { addToast } = useToast();

    return (
        <div>
            <button
                onClick={() =>
                    addToast({ message: 'Успех!', type: 'success', duration: 300 })
                }
            >
                Add Toast
            </button>
            <ToastList />
        </div>
    );
};

describe('Toast System', () => {
    it('показывает тост и таймер работает корректно', () => {
        vi.useFakeTimers(); // ✅ используем фиктивные таймеры

        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        fireEvent.click(screen.getByText('Add Toast'));
        expect(screen.getByText('Успех!')).toBeInTheDocument();

        vi.advanceTimersByTime(200);
        expect(screen.getByText('Успех!')).toBeInTheDocument();

        vi.advanceTimersByTime(200);
        expect(screen.queryByText('Успех!')).toBeNull(); // ✅ проверяем исчезновение

        vi.useRealTimers();
    });

    it('при наведении курсора таймер ставится на паузу', () => {
        vi.useFakeTimers();

        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        fireEvent.click(screen.getByText('Add Toast'));
        const toast = screen.getByText('Успех!').parentElement!;

        fireEvent.mouseEnter(toast); // ✅ пауза таймера
        vi.advanceTimersByTime(1000);
        expect(screen.getByText('Успех!')).toBeInTheDocument();

        fireEvent.mouseLeave(toast); // ✅ таймер продолжается
        vi.advanceTimersByTime(300);
        expect(screen.queryByText('Успех!')).toBeNull();

        vi.useRealTimers();
    });

    it('сбрасывает таймер при повторном тосте (дедупликация)', () => {
        vi.useFakeTimers();

        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        const addButton = screen.getByText('Add Toast');

        fireEvent.click(addButton);
        vi.advanceTimersByTime(200);

        fireEvent.click(addButton); // ✅ повторный тост сбрасывает таймер
        vi.advanceTimersByTime(150);
        expect(screen.getByText('Успех!')).toBeInTheDocument();

        vi.advanceTimersByTime(300);
        expect(screen.queryByText('Успех!')).toBeNull();

        vi.useRealTimers();
    });
});




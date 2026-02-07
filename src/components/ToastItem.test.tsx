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
        vi.useFakeTimers();

        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        fireEvent.click(screen.getByText('Add Toast'));
        expect(screen.getByText('Успех!')).toBeInTheDocument();

        // Таймер еще не истек
        vi.advanceTimersByTime(200);
        expect(screen.getByText('Успех!')).toBeInTheDocument();

        // Таймер истек
        vi.advanceTimersByTime(200);
        expect(screen.queryByText('Успех!')).toBeNull();

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

        fireEvent.mouseEnter(toast); // пауза таймера
        vi.advanceTimersByTime(1000); // прошло больше, чем duration
        expect(screen.getByText('Успех!')).toBeInTheDocument(); // тост еще есть

        fireEvent.mouseLeave(toast); // продолжаем таймер
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

        // Добавляем первый тост
        fireEvent.click(addButton);
        vi.advanceTimersByTime(200);

        // Добавляем повторный тост с тем же текстом
        fireEvent.click(addButton);

        // Таймер должен быть сброшен, тост еще виден
        vi.advanceTimersByTime(150);
        expect(screen.getByText('Успех!')).toBeInTheDocument();

        // После полного истечения таймера тост исчезает
        vi.advanceTimersByTime(300);
        expect(screen.queryByText('Успех!')).toBeNull();

        vi.useRealTimers();
    });
});



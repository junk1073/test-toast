import './App.css';
import { ToastProvider, useToast } from './context/ToastContext';
import ToastList from './components/ToastList';

// ✅ компонент с кнопками для тестирования тостов
const TriggerButtons = () => {
  const { addToast } = useToast();

  return (
    <div className="card">
      <h2>Test Controls</h2>
      <div className="buttons-grid">
        <button
          className="btn-success"
          onClick={() => addToast({ message: 'Успех!', type: 'success', duration: 3000 })}
        >
          Success Toast
        </button>

        <button
          className="btn-error"
          onClick={() => addToast({ message: 'Ошибка!', type: 'error', duration: 5000 })}
        >
          Error (5s) {/* ✅ тост "ошибка" висит дольше специально для демонстрации */}
        </button>

        <button
          className="btn-warning"
          onClick={() => addToast({ message: 'Предупрежение', type: 'warning', duration: 4000 })}
        >
          Warning
        </button>
      </div>

      <p style={{ marginTop: 20, color: '#888' }}>
        Наведите курсор на тост, чтобы приостановить таймер. {/* ✅ демонстрация pauseTimer */}
      </p>
    </div>
  );
};

function App() {
  return (
    <ToastProvider> {/* ✅ обернул всё в контекст тостов */}
      <div className="app-layout">
        <header className="header">
          <h1>Система управления тостами</h1>
        </header>

        <main className="content">
          <TriggerButtons /> {/* ✅ кнопки для добавления тостов */}
          <div className="dummy-content">
            <p>Основная область содержимого</p>
          </div>
        </main>

        <ToastList /> {/* ✅ рендер списка тостов */}
      </div>
    </ToastProvider>
  );
}

export default App;


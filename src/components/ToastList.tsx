import { useToast } from '../context/ToastContext';
import ToastItem from './ToastItem'; // ✅ импорт компонента тоста

const ToastList: React.FC = () => {
    const { toasts, removeToast } = useToast(); // ✅ получаем тосты и функцию удаления из контекста

    return (
        <div className="toast-list">
            {toasts.map((toast) => (
                // ✅ рендерим каждый тост через компонент ToastItem
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

export default ToastList;


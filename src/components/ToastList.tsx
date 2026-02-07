import { useToast } from '../context/ToastContext';
import ToastItem from './ToastItem'; // исправлено на default export

const ToastList: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="toast-list">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

export default ToastList;

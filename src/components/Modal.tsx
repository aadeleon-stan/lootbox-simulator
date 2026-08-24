import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 mx-4 w-full max-w-sm ${className ?? ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-xl font-bold mb-3">{title}</h3>}
        {children}
        {onClose && (
          <button
            className="mt-4 w-full py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

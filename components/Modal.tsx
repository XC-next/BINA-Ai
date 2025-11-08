import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm dark:bg-black/50"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
    >
      <div
        className="relative w-full max-w-md p-6 m-4 bg-[#EDE9F4] dark:bg-[#161625] rounded-3xl text-[#4A4A6A] dark:text-[#E0E0FF] shadow-[8px_8px_16px_#c9c5d0,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#0e0e18,-8px_-8px_16px_#1e1e32] transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-2xl font-bold mb-4">{title}</h2>
        <div id="modal-description" className="mb-6 text-slate-600 dark:text-slate-300">
            {children}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 font-semibold text-slate-700 dark:text-slate-200 bg-[#E6E0F0] dark:bg-[#2C2C44] rounded-2xl shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1e1e30,-5px_-5px_10px_#3a3a58] active:shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#1e1e30,inset_-5px_-5px_10px_#3a3a58] transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 font-semibold text-white bg-red-500 rounded-2xl shadow-[5px_5px_10px_#d9463c,-5px_-5px_10px_#ff6c60] active:shadow-[inset_5px_5px_10px_#d9463c,inset_-5px_-5px_10px_#ff6c60] transition-all duration-150"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
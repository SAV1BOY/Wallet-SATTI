import React from 'react';
import { IconLeft } from '../icons/Icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, title }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-zinc-900 text-zinc-100 shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex items-center gap-2 p-4 border-b border-zinc-800">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-zinc-800"><IconLeft /></button>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
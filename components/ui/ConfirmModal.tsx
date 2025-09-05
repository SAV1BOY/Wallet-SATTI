
import React from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, onClose, onConfirm, title, children }) => {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-zinc-200">{children}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600">Cancelar</button>
          <button onClick={handleConfirm} className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white">Confirmar</button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

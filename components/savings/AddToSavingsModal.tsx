import React, { useState, useEffect } from 'react';
import { SavingsGoal } from '../../types';
import Modal from '../ui/Modal';
import CurrencyInput from '../ui/CurrencyInput';

interface AddToSavingsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { goalId: string; amount: number }) => void;
  goal: SavingsGoal | null;
}

const AddToSavingsModal: React.FC<AddToSavingsModalProps> = ({ open, onClose, onSave, goal }) => {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!open) {
      setAmount(0);
    }
  }, [open]);

  if (!goal) return null;

  const handleSave = () => {
    if (amount <= 0) {
      alert('Por favor, insira um valor maior que zero.');
      return;
    }
    onSave({ goalId: goal.id, amount });
  };

  return (
    <Modal open={open} onClose={onClose} title={`Adicionar à Meta: ${goal.name}`}>
      <div className="px-1 space-y-4">
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3">
          <div className="text-zinc-500 dark:text-zinc-400 text-sm">Valor a Adicionar</div>
          <CurrencyInput value={amount} onChange={setAmount} />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          Esta ação criará uma nova despesa na categoria "Poupança" para manter seu balanço correto.
        </p>
        <div className="pt-2">
          <button onClick={handleSave} className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors">
            Adicionar à Poupança
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddToSavingsModal;
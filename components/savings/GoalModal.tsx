
import React, { useState, useEffect } from 'react';
import { SavingsGoal } from '../../types';
import Modal from '../ui/Modal';

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'savedAmount'> & { id?: string }) => void;
  initial: SavingsGoal | null;
}

const GoalModal: React.FC<GoalModalProps> = ({ open, onClose, onSave, initial }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    if (open) {
      if (initial) {
        setName(initial.name);
        setTargetAmount(initial.targetAmount);
        setTargetDate(initial.targetDate || '');
      } else {
        setName('');
        setTargetAmount(0);
        setTargetDate('');
      }
    }
  }, [initial, open]);

  const handleSave = () => {
    if (!name.trim() || targetAmount <= 0) {
      alert('Por favor, preencha o nome e um valor alvo maior que zero.');
      return;
    }
    onSave({
      id: initial?.id,
      name,
      targetAmount,
      targetDate: targetDate || undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Editar Meta' : 'Nova Meta de Poupança'}>
      <div className="px-1 space-y-4">
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Nome da Meta</label>
          <input
            className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-cyan-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Viagem para o Japão"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Valor Alvo (R$)</label>
          <input
            className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-cyan-500"
            type="number"
            value={targetAmount || ''}
            onChange={(e) => setTargetAmount(parseFloat(e.target.value) || 0)}
            placeholder="20000"
          />
        </div>
        
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Data Alvo (Opcional)</label>
          <input
            type="date"
            className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-cyan-500"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <button onClick={handleSave} className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors">
            Salvar Meta
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GoalModal;

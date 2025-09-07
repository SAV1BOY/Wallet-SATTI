
import React, { useState, useEffect } from 'react';
import { SavingsGoal, Settings } from '../../types';
import Modal from '../ui/Modal';
import CurrencyInput from '../ui/CurrencyInput';
import { useLanguage } from '../LanguageProvider';
import { fmtMoney } from '../../utils/helpers';

interface AddToSavingsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { goalId: string; amount: number }) => void;
  goal: SavingsGoal | null;
  settings: Settings;
}

const AddToSavingsModal: React.FC<AddToSavingsModalProps> = ({ open, onClose, onSave, goal, settings }) => {
  const { t, locale } = useLanguage();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!open) {
      setAmount(0);
    }
  }, [open]);

  if (!goal) return null;

  const handleSave = () => {
    if (amount <= 0) {
      alert(t('modals.valueGreaterThanZero'));
      return;
    }
    onSave({ goalId: goal.id, amount });
  };

  return (
    <Modal open={open} onClose={onClose} title={t('modals.addToGoal', { name: goal.name })}>
      <div className="px-1 space-y-4">
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3">
          <div className="text-zinc-500 dark:text-zinc-400 text-sm">{t('addToSavings.amountToAdd')}</div>
          <CurrencyInput value={amount} onChange={setAmount} placeholder={fmtMoney(0, settings.currency, locale)} />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          {t('addToSavings.description')}
        </p>
        <div className="pt-2">
          <button onClick={handleSave} className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors">
            {t('addToSavings.addToSavings')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddToSavingsModal;

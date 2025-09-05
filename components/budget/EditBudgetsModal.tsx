import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Budget, Category } from '../../types';
import { pad } from '../../utils/helpers';

interface EditBudgetsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (budgets: Omit<Budget, 'month'>[]) => void;
  cursor: Date;
  budgets: Budget[];
  categories: { receita: Category[], despesa: Category[] };
}

const EditBudgetsModal: React.FC<EditBudgetsModalProps> = ({ open, onClose, onSave, cursor, budgets, categories }) => {
    const [monthlyBudgets, setMonthlyBudgets] = useState<{ [key: string]: number }>({});
    const monthStr = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}`;

    useEffect(() => {
        if (open) {
            const currentBudgets = budgets
                .filter(b => b.month === monthStr)
                .reduce((acc, b) => {
                    acc[b.categoryId] = b.amount;
                    return acc;
                }, {} as { [key: string]: number });
            setMonthlyBudgets(currentBudgets);
        }
    }, [open, budgets, monthStr]);

    const handleAmountChange = (categoryId: string, amount: number) => {
        setMonthlyBudgets(prev => ({ ...prev, [categoryId]: amount }));
    };

    const handleSave = () => {
        const budgetsToSave = Object.entries(monthlyBudgets)
            .map(([categoryId, amount]) => ({ categoryId, amount }));
        onSave(budgetsToSave);
    };

    return (
        <Modal open={open} onClose={onClose} title={`Editar Orçamento - ${cursor.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`}>
            <div className="px-1 space-y-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Defina o valor máximo de gastos para cada categoria neste mês. Deixe em branco ou com R$ 0,00 para não definir um orçamento.</p>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {categories.despesa.map(cat => (
                        <div key={cat.id} className="flex items-center gap-4 p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
                            <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl">{cat.icon}</span>
                                <span>{cat.label}</span>
                            </div>
                            <div className="w-40">
                                <input
                                    className="w-full bg-white dark:bg-zinc-800 text-lg font-semibold outline-none border border-zinc-300 dark:border-zinc-700 rounded-md p-2 text-right focus:border-cyan-500"
                                    type="number"
                                    placeholder="0,00"
                                    value={monthlyBudgets[cat.id] || ''}
                                    onChange={(e) => handleAmountChange(cat.id, parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-2">
                    <button onClick={handleSave} className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors">
                        Salvar Orçamento
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditBudgetsModal;
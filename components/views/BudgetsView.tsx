import React, { useMemo } from 'react';
import { AppData, Occurrence, Settings, Category } from '../../types';
import { isSameYM, parseDate, fmtMoney, pad } from '../../utils/helpers';
import { IconEdit } from '../icons/Icon';

interface BudgetsViewProps {
  allOccurrences: Occurrence[];
  cursor: Date;
  data: AppData;
  onEdit: () => void;
  settings: Settings;
  categories: { receita: Category[], despesa: Category[] };
}

const BudgetsView: React.FC<BudgetsViewProps> = ({ allOccurrences, cursor, data, onEdit, settings, categories }) => {
    const monthStr = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}`;

    const monthlyExpensesByCategory = useMemo(() => {
        const expenses: { [key: string]: number } = {};
        allOccurrences
            .filter(o => o.kind === 'despesa' && isSameYM(parseDate(o.dueDate), cursor) && !data.skips[o.id])
            .forEach(o => {
                expenses[o.category] = (expenses[o.category] || 0) + o.value;
            });
        return expenses;
    }, [allOccurrences, cursor, data.skips]);

    const budgetData = useMemo(() => {
        const monthBudgets = data.budgets.filter(b => b.month === monthStr);
        
        const allCategoryIds = new Set([
            ...Object.keys(monthlyExpensesByCategory),
            ...monthBudgets.map(b => b.categoryId)
        ]);
        
        return categories.despesa
            .filter(cat => allCategoryIds.has(cat.id))
            .map(cat => {
                const spent = monthlyExpensesByCategory[cat.id] || 0;
                const budgeted = monthBudgets.find(b => b.categoryId === cat.id)?.amount || 0;
                const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
                return {
                    ...cat,
                    spent,
                    budgeted,
                    remaining: budgeted - spent,
                    percentage
                };
            });
    }, [monthlyExpensesByCategory, data.budgets, monthStr, categories.despesa]);

    const totals = useMemo(() => {
        return budgetData.reduce((acc, item) => {
            acc.spent += item.spent;
            acc.budgeted += item.budgeted;
            return acc;
        }, { spent: 0, budgeted: 0 });
    }, [budgetData]);

    const getProgressBarColor = (percentage: number) => {
        if (percentage > 100) return 'bg-rose-500';
        if (percentage > 80) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Orçamento do Mês</h3>
                    <button onClick={onEdit} className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300">
                        <IconEdit size={16} />
                        Editar
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Orçado</div>
                        <div className="text-lg font-semibold">{fmtMoney(totals.budgeted, settings.currency)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Gasto</div>
                        <div className="text-lg font-semibold">{fmtMoney(totals.spent, settings.currency)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Restante</div>
                        <div className={`text-lg font-semibold ${totals.budgeted - totals.spent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {fmtMoney(totals.budgeted - totals.spent, settings.currency)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {budgetData.map(item => (
                    <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 font-medium">
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold">{fmtMoney(item.spent, settings.currency)}</span>
                                <span className="text-zinc-500 dark:text-zinc-400"> / {fmtMoney(item.budgeted, settings.currency)}</span>
                            </div>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${getProgressBarColor(item.percentage)}`}
                                style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            ></div>
                        </div>
                        <div className="text-right text-xs mt-1 text-zinc-500 dark:text-zinc-400">
                            {item.remaining >= 0 ? `${fmtMoney(item.remaining, settings.currency)} restantes` : `${fmtMoney(Math.abs(item.remaining), settings.currency)} acima`}
                        </div>
                    </div>
                ))}
                {budgetData.length === 0 && (
                    <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
                        <p className="mb-6">Nenhum orçamento definido para este mês.</p>
                        <button onClick={onEdit} className="mx-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors">
                            Definir Orçamento
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetsView;
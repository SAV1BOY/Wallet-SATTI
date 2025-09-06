import React, { useMemo } from 'react';
// FIX: Import 'Category' type.
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
                const percentage = budgeted > 0 ? (spent / budgeted) * 100 : (spent > 0 ? 101 : 0);
                return {
                    ...cat,
                    spent,
                    budgeted,
                    remaining: budgeted - spent,
                    percentage
                };
            })
            .sort((a, b) => b.percentage - a.percentage);
    }, [monthlyExpensesByCategory, data.budgets, monthStr, categories.despesa]);

    const totals = useMemo(() => {
        return budgetData.reduce((acc, item) => {
            acc.spent += item.spent;
            acc.budgeted += item.budgeted;
            return acc;
        }, { spent: 0, budgeted: 0 });
    }, [budgetData]);

    const getProgressBarClasses = (percentage: number) => {
        if (percentage > 100) return 'bg-gradient-to-r from-rose-500 to-red-600';
        if (percentage > 80) return 'bg-gradient-to-r from-amber-400 to-orange-500';
        if (percentage > 50) return 'bg-gradient-to-r from-lime-400 to-yellow-500';
        return 'bg-gradient-to-r from-emerald-400 to-cyan-500';
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
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl grid place-items-center text-xl flex-shrink-0" style={{ backgroundColor: `${item.color}20` }}>
                                    <span>{item.icon}</span>
                                </div>
                                <div className="font-semibold text-zinc-900 dark:text-zinc-100">{item.label}</div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                                <div className={`text-lg font-bold ${item.remaining >= 0 ? 'text-zinc-800 dark:text-zinc-200' : 'text-rose-500'}`}>
                                    {fmtMoney(item.remaining, settings.currency)}
                                </div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {item.remaining >= 0 ? 'Restante' : 'Estourado'}
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarClasses(item.percentage)}`}
                                style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            ></div>
                        </div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400 flex justify-between mt-1.5">
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{fmtMoney(item.spent, settings.currency)}</span>
                            <span>de {fmtMoney(item.budgeted, settings.currency)} ({item.percentage.toFixed(0)}%)</span>
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
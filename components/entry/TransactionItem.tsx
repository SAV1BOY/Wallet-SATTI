import React from 'react';
import { Occurrence, Settings, Category } from '../../types';
import { overdueStatus, fmtMoney, parseDate } from '../../utils/helpers';
import { IconCheck } from '../icons/Icon';

interface TransactionItemProps {
  occurrence: Occurrence;
  isPaid: boolean;
  category: Category | undefined;
  settings: Settings;
  onSelect: (occ: Occurrence) => void;
  onTogglePaid: (occ: Occurrence) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  occurrence,
  isPaid,
  category,
  settings,
  onSelect,
  onTogglePaid
}) => {
  const isOverdue = overdueStatus(occurrence.dueDate) === 'overdue';
  const categoryColor = category ? `${category.color}20` : 'transparent';

  return (
    <div
      onClick={() => onSelect(occurrence)}
      className={`w-full text-left py-3 flex items-center justify-between transition-colors cursor-pointer rounded-lg px-2 -mx-2 ${
        isOverdue && !isPaid
          ? 'bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40'
          : isPaid
          ? 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
          : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 rounded-full grid place-items-center text-xl flex-shrink-0" style={{ backgroundColor: categoryColor }}>
          <span>{category?.icon}</span>
        </div>
        <div className="truncate">
          <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{occurrence.description}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            {parseDate(occurrence.dueDate).toLocaleDateString("pt-BR")}
            {isPaid && <span className="text-emerald-400">• {occurrence.kind === 'receita' ? 'Recebido' : 'Pago'}</span>}
            {isOverdue && !isPaid && <span className="text-rose-400">• Vencido</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-2">
        <div className={`font-semibold text-right ${occurrence.kind === "receita" ? "text-emerald-400" : "text-rose-400"}`}>
          {occurrence.kind === "receita" ? "+ " : "- "}{fmtMoney(occurrence.value, settings.currency)}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePaid(occurrence);
          }}
          className={`w-7 h-7 flex-shrink-0 rounded-full border-2 grid place-items-center transition-all duration-200 
          ${isPaid
              ? 'bg-emerald-500 border-emerald-400 text-white'
              : 'bg-transparent border-zinc-400 dark:border-zinc-600 text-zinc-400 dark:text-zinc-600 hover:border-zinc-500 dark:hover:border-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-400'
          }`}
          aria-label={isPaid ? "Marcar como não pago" : (occurrence.kind === 'receita' ? "Marcar como recebido" : "Marcar como pago")}
        >
          <IconCheck size={16} className={`transition-transform duration-200 ${isPaid ? 'scale-100' : 'scale-0'}`} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(TransactionItem);
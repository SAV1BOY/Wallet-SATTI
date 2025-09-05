
import React, { useState, useMemo } from 'react';
import { AppData, Occurrence, Settings, Category } from '../../types';
import { isSameYM, parseDate, overdueStatus, fmtMoney } from '../../utils/helpers';
import { IconSearch, IconCheck } from '../icons/Icon';

interface TransactionsViewProps {
  allOccurrences: Occurrence[];
  cursor: Date;
  data: AppData;
  onSelect: (occ: Occurrence) => void;
  onAdd: () => void;
  settings: Settings;
  onTogglePaid: (occ: Occurrence) => void;
  categories: { receita: Category[], despesa: Category[] };
}

const TransactionsView: React.FC<TransactionsViewProps> = ({ allOccurrences, cursor, data, onSelect, onAdd, settings, onTogglePaid, categories }) => {
  const [tab, setTab] = useState<'todos' | 'receitas' | 'despesas'>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const occurrences = useMemo(() => {
    return allOccurrences
      .filter(o => isSameYM(parseDate(o.dueDate), cursor))
      .filter(o => !data.skips?.[o.id])
      .sort((a, b) => parseDate(a.dueDate).getTime() - parseDate(b.dueDate).getTime());
  }, [allOccurrences, data.skips, cursor]);

  const filtered = useMemo(() => {
    let result = occurrences;
    if (tab === "receitas") result = result.filter(o => o.kind === "receita");
    if (tab === "despesas") result = result.filter(o => o.kind === "despesa");
    if (searchQuery) {
      result = result.filter(o =>
        o.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [occurrences, tab, searchQuery]);

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Buscar lançamentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="flex gap-6 border-b border-zinc-800 mb-4">
        {[{ id: "todos", label: "Todos" }, { id: "receitas", label: "Receitas" }, { id: "despesas", label: "Despesas" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as 'todos' | 'receitas' | 'despesas')} className={`pb-2 text-sm transition-colors ${tab === t.id ? "text-cyan-300 border-b-2 border-cyan-400" : "text-zinc-400 hover:text-zinc-200"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <p className="mb-6">{searchQuery ? `Nenhum resultado para "${searchQuery}"` : `Não há ${tab === 'todos' ? 'lançamentos' : tab} neste mês`}</p>
          {!searchQuery && (
            <button onClick={onAdd} className="mx-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors">
              Novo Lançamento
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((o) => {
            const paid = !!data.payments[`paid:${o.id}`];
            const category = categories[o.kind].find(cat => cat.id === o.category);
            const isOverdue = overdueStatus(o.dueDate) === 'overdue';
            const categoryColor = category ? `${category.color}20` : 'transparent';
            
            return (
              <div key={o.id} onClick={() => onSelect(o)} className="w-full text-left py-3 flex items-center justify-between hover:bg-zinc-900/50 transition-colors cursor-pointer rounded-lg px-2 -mx-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full grid place-items-center text-xl flex-shrink-0" style={{ backgroundColor: categoryColor }}>
                    <span>{category?.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium text-zinc-100">{o.description}</div>
                    <div className="text-xs text-zinc-400 flex items-center gap-2">
                      {parseDate(o.dueDate).toLocaleDateString("pt-BR")}
                      {isOverdue && !paid && <span className="text-rose-400">• Vencido</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`font-semibold text-right ${o.kind === "receita" ? "text-emerald-400" : "text-rose-400"}`}>
                    {o.kind === "receita" ? "+ " : "- "}{fmtMoney(o.value, settings.currency)}
                  </div>
                  <button
                      onClick={(e) => {
                          e.stopPropagation();
                          onTogglePaid(o);
                      }}
                      className={`w-7 h-7 flex-shrink-0 rounded-full border-2 grid place-items-center transition-all duration-200 
                      ${paid 
                          ? 'bg-emerald-500 border-emerald-400 text-white' 
                          : 'bg-transparent border-zinc-600 text-zinc-600 hover:border-zinc-400 hover:text-zinc-400'
                      }`}
                      aria-label={paid ? "Marcar como não pago" : (o.kind === 'receita' ? "Marcar como recebido" : "Marcar como pago")}
                  >
                      <IconCheck size={16} className={`transition-transform duration-200 ${paid ? 'scale-100' : 'scale-0'}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionsView;
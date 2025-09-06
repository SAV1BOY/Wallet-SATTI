
import React, { useState, useMemo } from 'react';
import { AppData, Occurrence, Settings, Category, TransactionFilters, ValueFilter } from '../../types';
import { isSameYM, parseDate } from '../../utils/helpers';
import { IconSearch, IconFilter } from '../icons/Icon';
import TransactionItem from '../entry/TransactionItem';
import TransactionFilterModal from '../entry/TransactionFilterModal';

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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    selectedCategories: [],
    valueFilter: { operator: null, value: null },
    dateFilter: { startDate: null, endDate: null },
  });

  const occurrences = useMemo(() => {
    const { startDate, endDate } = filters.dateFilter || {};
    let result = allOccurrences
      .filter(o => !data.skips?.[o.id]);

    if (startDate || endDate) {
        if (startDate) {
            const start = parseDate(startDate);
            start.setHours(0, 0, 0, 0);
            result = result.filter(occ => parseDate(occ.dueDate) >= start);
        }
        if (endDate) {
            const end = parseDate(endDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter(occ => parseDate(occ.dueDate) <= end);
        }
    } else {
        result = result.filter(o => isSameYM(parseDate(o.dueDate), cursor));
    }
    
    return result.sort((a, b) => parseDate(a.dueDate).getTime() - parseDate(b.dueDate).getTime());
  }, [allOccurrences, data.skips, cursor, filters.dateFilter]);

  const filtered = useMemo(() => {
    let result = occurrences;
    
    if (tab === "receitas") result = result.filter(o => o.kind === "receita");
    if (tab === "despesas") result = result.filter(o => o.kind === "despesa");
    
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.description.toLowerCase().includes(lowercasedQuery)
      );
    }

    if (filters.selectedCategories.length > 0) {
      result = result.filter(o => filters.selectedCategories.includes(o.category));
    }
    
    const { operator, value } = filters.valueFilter;
    if (operator && value !== null && value > 0) {
        result = result.filter(o => {
            if (operator === 'gt') return o.value > value;
            if (operator === 'lt') return o.value < value;
            if (operator === 'eq') return o.value === value;
            return true;
        });
    }

    return result;
  }, [occurrences, tab, searchQuery, filters]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.receita.forEach(c => map.set(c.id, c));
    categories.despesa.forEach(c => map.set(c.id, c));
    return map;
  }, [categories]);
  
  const handleApplyFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const areFiltersActive = useMemo(() => {
    const { startDate, endDate } = filters.dateFilter || {};
    return filters.selectedCategories.length > 0 
        || (filters.valueFilter.operator !== null && filters.valueFilter.value !== null && filters.valueFilter.value > 0)
        || !!startDate || !!endDate;
  }, [filters]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Buscar lançamentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500"
          />
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className={`relative flex-shrink-0 px-3 flex items-center justify-center rounded-xl border transition-colors ${
              areFiltersActive
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
          }`}
          aria-label="Filtros avançados"
      >
          <IconFilter size={20} />
          {areFiltersActive && <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500"></div>}
      </button>
      </div>

      <div className="flex gap-6 border-b border-zinc-200 dark:border-zinc-800 mb-4">
        {[{ id: "todos", label: "Todos" }, { id: "receitas", label: "Receitas" }, { id: "despesas", label: "Despesas" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as 'todos' | 'receitas' | 'despesas')} className={`pb-2 text-sm transition-colors ${tab === t.id ? "text-cyan-600 dark:text-cyan-300 border-b-2 border-cyan-500 dark:border-cyan-400" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
          <p className="mb-6">{searchQuery || areFiltersActive ? `Nenhum resultado para os filtros aplicados.` : `Não há ${tab === 'todos' ? 'lançamentos' : tab} neste mês`}</p>
          {!searchQuery && !areFiltersActive && (
            <button onClick={onAdd} className="mx-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors">
              Novo Lançamento
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((o) => {
            const isPaid = !!data.payments[`paid:${o.id}`];
            const category = categoryMap.get(o.category);
            
            return (
              <TransactionItem
                key={o.id}
                occurrence={o}
                isPaid={isPaid}
                category={category}
                settings={settings}
                onSelect={onSelect}
                onTogglePaid={onTogglePaid}
              />
            );
          })}
        </div>
      )}

      <TransactionFilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        categories={categories}
        initialFilters={filters}
      />
    </div>
  );
};

export default TransactionsView;
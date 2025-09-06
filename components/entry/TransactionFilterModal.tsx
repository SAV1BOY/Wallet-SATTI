
import React, { useState, useEffect } from 'react';
import { Category, TransactionFilters, ValueFilter, ValueFilterOperator } from '../../types';
import Modal from '../ui/Modal';
import Chip from '../ui/Chip';

interface TransactionFilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: TransactionFilters) => void;
  initialFilters: TransactionFilters;
  categories: { receita: Category[], despesa: Category[] };
}

const TransactionFilterModal: React.FC<TransactionFilterModalProps> = ({ open, onClose, onApply, initialFilters, categories }) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.selectedCategories);
    const [valueFilter, setValueFilter] = useState<ValueFilter>(initialFilters.valueFilter);
    const [dateFilter, setDateFilter] = useState(initialFilters.dateFilter || { startDate: null, endDate: null });

    useEffect(() => {
        if(open) {
            setSelectedCategories(initialFilters.selectedCategories);
            setValueFilter(initialFilters.valueFilter);
            setDateFilter(initialFilters.dateFilter || { startDate: null, endDate: null });
        }
    }, [open, initialFilters]);

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId) 
                : [...prev, categoryId]
        );
    };

    const handleApply = () => {
        onApply({ selectedCategories, valueFilter, dateFilter });
    };

    const handleClear = () => {
        setSelectedCategories([]);
        setValueFilter({ operator: null, value: null });
        setDateFilter({ startDate: null, endDate: null });
    };

    return (
        <Modal open={open} onClose={onClose} title="Filtros Avançados">
            <div className="space-y-6">
                <CategoryFilterSection 
                    title="Categorias de Receita"
                    categories={categories.receita}
                    selected={selectedCategories}
                    onToggle={handleCategoryToggle}
                />
                <CategoryFilterSection 
                    title="Categorias de Despesa"
                    categories={categories.despesa}
                    selected={selectedCategories}
                    onToggle={handleCategoryToggle}
                />
                
                <div>
                    <h4 className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Filtrar por Valor</h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <select
                            value={valueFilter.operator || ''}
                            onChange={(e) => setValueFilter(prev => ({...prev, operator: e.target.value as ValueFilterOperator | null}))}
                            className="flex-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500"
                        >
                            <option value="">Qualquer Valor</option>
                            <option value="gt">Maior que</option>
                            <option value="lt">Menor que</option>
                            <option value="eq">Igual a</option>
                        </select>
                        <input
                            type="number"
                            placeholder="0,00"
                            value={valueFilter.value || ''}
                            onChange={(e) => setValueFilter(prev => ({...prev, value: parseFloat(e.target.value) || null}))}
                            disabled={!valueFilter.operator}
                            className="flex-1 w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Filtrar por Data</h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="date"
                            value={dateFilter.startDate || ''}
                            onChange={(e) => setDateFilter(prev => ({...prev, startDate: e.target.value || null}))}
                            className="flex-1 w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500"
                            aria-label="Data de início"
                        />
                        <input
                            type="date"
                            value={dateFilter.endDate || ''}
                            onChange={(e) => setDateFilter(prev => ({...prev, endDate: e.target.value || null}))}
                            className="flex-1 w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500"
                            aria-label="Data de fim"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <button onClick={handleClear} className="px-4 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-100">Limpar Filtros</button>
                    <button onClick={handleApply} className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white">Aplicar Filtros</button>
                </div>
            </div>
        </Modal>
    );
};

interface CategoryFilterSectionProps {
    title: string;
    categories: Category[];
    selected: string[];
    onToggle: (id: string) => void;
}

const CategoryFilterSection: React.FC<CategoryFilterSectionProps> = ({ title, categories, selected, onToggle }) => (
    <div>
        <h4 className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">{title}</h4>
        <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
                <Chip 
                    key={cat.id} 
                    active={selected.includes(cat.id)}
                    onClick={() => onToggle(cat.id)}
                >
                    <span className="flex items-center gap-1.5">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </span>
                </Chip>
            ))}
        </div>
    </div>
);


export default TransactionFilterModal;
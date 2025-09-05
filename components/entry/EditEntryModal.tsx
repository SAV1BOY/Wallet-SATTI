import React, { useState, useEffect } from 'react';
import { Kind, Recurrence, Frequency, Entry, Category } from '../../types';
import Modal from '../ui/Modal';
import CurrencyInput from '../ui/CurrencyInput';
import Chip from '../ui/Chip';

interface EditEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: Entry) => void;
  initial: Entry;
  categories: { receita: Category[], despesa: Category[] };
}

const EditEntryModal: React.FC<EditEntryModalProps> = ({ open, onClose, onSave, initial, categories }) => {
  const [entry, setEntry] = useState<Entry>(initial);
  
  useEffect(() => { setEntry(initial); }, [initial]);

  const handleChange = <K extends keyof Entry,>(field: K, value: Entry[K]) => {
    setEntry(e => ({ ...e, [field]: value }));
  };
  
  const handleKindChange = (kind: Kind) => {
    const defaultCategory = kind === 'receita' ? (categories.receita[0]?.id || '') : (categories.despesa[0]?.id || '');
    setEntry(e => ({
        ...e,
        kind,
        category: defaultCategory
    }));
  };

  const handleSave = () => {
    if (!entry.description.trim() || !entry.value || entry.value <= 0 || !entry.category) {
      alert('Preencha todos os campos obrigatórios: Descrição, Valor e Categoria.');
      return;
    }
    onSave(entry);
  };

  if (!entry) return null;

  const availableCategories = categories[entry.kind] || [];
  
  return (
    <Modal open={open} onClose={onClose} title="Editar lançamento">
      <div className="px-1 space-y-4">
        <div className="flex items-center gap-6">
          <button onClick={() => handleKindChange('despesa')} className={`pb-2 transition-colors ${entry.kind === 'despesa' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>Despesa</button>
          <button onClick={() => handleKindChange('receita')} className={`pb-2 transition-colors ${entry.kind === 'receita' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>Receita</button>
        </div>
        
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3">
          <div className="text-zinc-500 dark:text-zinc-400 text-sm">{entry.kind === 'receita' ? 'Valor da Receita' : 'Valor da Despesa'}</div>
          <CurrencyInput value={entry.value} onChange={v => handleChange('value', v)} />
        </div>
        
        <div>
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-1 block">Descrição</label>
          <input className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500" value={entry.description} onChange={(e) => handleChange('description', e.target.value)} />
        </div>
        
        <div>
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 block">Categoria</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableCategories.map((cat) => (
              <button key={cat.id} onClick={() => handleChange('category', cat.id)} className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-colors ${entry.category === cat.id ? "bg-cyan-600/20 border-cyan-500 text-cyan-500 dark:text-cyan-300" : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"}`}>
                <span className="text-xl">{cat.icon}</span>
                <span className="text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-1 block">Data de Vencimento</label>
          <input type="date" className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500" value={entry.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} />
        </div>
        
        <div>
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 block">Recorrência</label>
          <div className="flex items-center gap-2 flex-wrap">
            <Chip active={entry.recurrence === 'none'} onClick={() => handleChange('recurrence', 'none')}>Não repetir</Chip>
            <Chip active={entry.recurrence === 'always'} onClick={() => handleChange('recurrence', 'always')}>Sempre</Chip>
            <Chip active={entry.recurrence === 'parcelado'} onClick={() => handleChange('recurrence', 'parcelado')}>Parcelado</Chip>
          </div>
        </div>
        
        {(entry.recurrence === 'always' || entry.recurrence === 'parcelado') && (
          <div>
            <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-1 block">Frequência</label>
            <select value={entry.frequency} onChange={(e) => handleChange('frequency', e.target.value as Frequency)} className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500">
              <option value="monthly">Mensalmente</option>
              <option value="6m">A cada 6 meses</option>
              <option value="yearly">Anualmente</option>
            </select>
          </div>
        )}
        
        {entry.recurrence === 'parcelado' && (
          <div>
            <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-1 block">Número de parcelas</label>
            <input type="number" min={1} value={entry.parcels} onChange={(e) => handleChange('parcels', parseInt(e.target.value || "1"))} className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500" />
          </div>
        )}
        
        <div className="pt-2 flex gap-2">
          <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors">Salvar Alterações</button>
          <button onClick={onClose} className="px-4 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700">Cancelar</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditEntryModal;
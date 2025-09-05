
import React, { useState, useEffect } from 'react';
import { Kind, Recurrence, Frequency, Entry, Category } from '../../types';
import Modal from '../ui/Modal';
import CurrencyInput from '../ui/CurrencyInput';
import Chip from '../ui/Chip';
import { dateISO } from '../../utils/helpers';

interface NewEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: Omit<Entry, 'id' | 'createdAt'>) => void;
  categories: { receita: Category[], despesa: Category[] };
}

const NewEntryModal: React.FC<NewEntryModalProps> = ({ open, onClose, onSave, categories }) => {
  const [kind, setKind] = useState<Kind>("despesa");
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState("");
  const [due, setDue] = useState(() => dateISO(new Date()));
  const [recurrence, setRecurrence] = useState<Recurrence>("none");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [parcels, setParcels] = useState(12);
  const [category, setCategory] = useState("");

  const availableCategories = categories[kind] || [];

  const reset = () => {
    setKind("despesa");
    setValue(0);
    setDescription("");
    setDue(dateISO(new Date()));
    setRecurrence("none");
    setFrequency("monthly");
    setParcels(12);
    setCategory(categories.despesa[0]?.id || "");
  };

  useEffect(() => {
    if (open) {
      setCategory(kind === 'receita' ? (categories.receita[0]?.id || "") : (categories.despesa[0]?.id || ""));
    } else {
      reset();
    }
  }, [open, kind, categories]);

  const handleSave = () => {
    if (!description.trim() || !value || value <= 0 || !category) {
      alert('Preencha todos os campos obrigatórios: Descrição, Valor e Categoria.');
      return;
    }
    onSave({
      kind,
      description: description.trim(),
      value: Math.round(value * 100) / 100,
      dueDate: due,
      recurrence,
      frequency,
      parcels,
      category
    });
    onClose();
  };
  
  return (
    <Modal open={open} onClose={onClose} title="Novo lançamento">
      <div className="px-1 space-y-4">
        <div className="flex items-center gap-6">
          <button onClick={() => setKind('despesa')} className={`pb-2 transition-colors ${kind === 'despesa' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Despesa</button>
          <button onClick={() => setKind('receita')} className={`pb-2 transition-colors ${kind === 'receita' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Receita</button>
        </div>
        
        <div className="bg-zinc-800 rounded-xl p-3">
          <div className="text-zinc-400 text-sm">{kind === 'receita' ? 'Valor da Receita' : 'Valor da Despesa'}</div>
          <CurrencyInput value={value} onChange={setValue} />
        </div>
        
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Descrição</label>
          <input className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-cyan-500" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={kind === 'receita' ? 'Salário' : 'Compras do mês'} />
        </div>
        
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Categoria</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableCategories.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)} className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-colors ${category === cat.id ? "bg-cyan-600/20 border-cyan-500 text-cyan-300" : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"}`}>
                <span className="text-xl">{cat.icon}</span>
                <span className="text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Data de Vencimento</label>
          <input type="date" className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-cyan-500" value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Recorrência</label>
          <div className="flex items-center gap-2 flex-wrap">
            <Chip active={recurrence === 'none'} onClick={() => setRecurrence('none')}>Não repetir</Chip>
            <Chip active={recurrence === 'always'} onClick={() => setRecurrence('always')}>Sempre</Chip>
            <Chip active={recurrence === 'parcelado'} onClick={() => setRecurrence('parcelado')}>Parcelado</Chip>
          </div>
        </div>
        
        {(recurrence === 'always' || recurrence === 'parcelado') && (
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Frequência</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)} className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-cyan-500">
              <option value="monthly">Mensalmente</option>
              <option value="6m">A cada 6 meses</option>
              <option value="yearly">Anualmente</option>
            </select>
          </div>
        )}
        
        {recurrence === 'parcelado' && (
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Número de parcelas</label>
            <input type="number" min={1} value={parcels} onChange={(e) => setParcels(parseInt(e.target.value || "1"))} className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-cyan-500" />
          </div>
        )}
        
        <div className="pt-2">
          <button onClick={handleSave} className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors">
            Salvar Lançamento
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NewEntryModal;
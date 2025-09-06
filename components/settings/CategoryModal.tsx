import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import Modal from '../ui/Modal';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'> & { id?: string }) => void;
  initial: Omit<Category, 'id'> & { id?: string } | null;
}

const colorPalette = [
    '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', 
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', 
    '#d946ef', '#ec4899', '#f43f5e', '#78716c'
];

const emojiPalette = [
    '💼', '💻', '🏢', '📈', '💰', '🍽️', '🚗', '🏠', '🏥', '📚', '🎬', '🐷', '📊', '🧾', '💸', '✈️',
    '🛒', '🎁', '🎓', '💡', '🔧', '❤️', '🐾', '👶', '📱', '👕', '💄', '🎉', '🍕', '☕', '💪', '🥎'
];

const CategoryModal: React.FC<CategoryModalProps> = ({ open, onClose, onSave, initial }) => {
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState(colorPalette[0]);
  
  useEffect(() => {
    if (open) {
      if (initial) {
        setLabel(initial.label || '');
        setIcon(initial.icon || '');
        setColor(initial.color || colorPalette[0]);
      } else {
        setLabel('');
        setIcon(emojiPalette[0]);
        setColor(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
      }
    }
  }, [initial, open]);

  const handleSave = () => {
    if (!label.trim() || !icon.trim()) {
      alert('Por favor, preencha o nome e o ícone (emoji).');
      return;
    }
    onSave({
      id: initial?.id,
      label,
      icon,
      color,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Editar Categoria' : 'Nova Categoria'}>
      <div className="px-1 space-y-4">
        <div>
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-1 block">Nome da Categoria</label>
          <input
            className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ex: Supermercado"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 block">Ícone (Emoji)</label>
          <div className="grid grid-cols-8 gap-2 bg-zinc-100 dark:bg-zinc-800 p-3 rounded-xl">
              {emojiPalette.map(emoji => (
                  <button 
                    key={emoji} 
                    onClick={() => setIcon(emoji)} 
                    className={`text-2xl w-10 h-10 rounded-lg grid place-items-center transition-all transform hover:scale-110 ${icon === emoji ? 'bg-cyan-500/30 ring-2 ring-cyan-500' : 'bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
                  >
                      {emoji}
                  </button>
              ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 block">Cor</label>
          <div className="grid grid-cols-8 gap-2">
              {colorPalette.map(c => (
                  <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 ${color === c ? 'border-zinc-800 dark:border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />
              ))}
          </div>
        </div>

        <div className="pt-2">
          <button onClick={handleSave} className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors">
            Salvar Categoria
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryModal;
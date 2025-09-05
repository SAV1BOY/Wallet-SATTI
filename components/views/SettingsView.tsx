
import React from 'react';
import { Currency, Settings, Category, Kind } from '../../types';
import { CURRENCY_OPTIONS } from '../../constants';
import CategoryManagement from '../settings/CategoryManagement';

interface SettingsViewProps {
  settings: Settings;
  categories: { receita: Category[], despesa: Category[] };
  onSettingsChange: (newSettings: Settings) => void;
  onReset: () => void;
  onAddCategory: (kind: Kind) => void;
  onEditCategory: (category: Category, kind: Kind) => void;
  onDeleteCategory: (category: Category, kind: Kind) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, categories, onSettingsChange, onReset, onAddCategory, onEditCategory, onDeleteCategory }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
        <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Modo escuro</div>
              <div className="text-sm text-zinc-400">Ativar tema escuro</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={!!settings.dark} 
                onChange={(e) => onSettingsChange({ ...settings, dark: e.target.checked })}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
        </div>
      </div>

      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
          <h4 className="text-sm font-medium mb-3">Moeda</h4>
          <select 
              value={settings.currency}
              onChange={(e) => onSettingsChange({ ...settings, currency: e.target.value as Currency })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-cyan-500"
          >
              {CURRENCY_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
          </select>
      </div>

      <CategoryManagement 
        categories={categories}
        onAdd={onAddCategory}
        onEdit={onEditCategory}
        onDelete={onDeleteCategory}
      />
      
      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
        <h4 className="text-sm font-medium mb-3">Dados</h4>
        <button onClick={onReset} className="px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white transition-colors">
          Resetar todos os dados
        </button>
      </div>

      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
        <h4 className="text-sm font-medium mb-2">Sobre</h4>
        <p className="text-xs text-zinc-400">Controle Financeiro Pro v1.1</p>
        <p className="text-xs text-zinc-400">Gerencie suas finanças com facilidade.</p>
      </div>
    </div>
  );
};

export default SettingsView;
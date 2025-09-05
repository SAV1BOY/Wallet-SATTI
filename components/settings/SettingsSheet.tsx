
import React from 'react';
import Sheet from '../ui/Sheet';
import { Currency, Settings } from '../../types';
import { CURRENCY_OPTIONS } from '../../constants';

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
  onReset: () => void;
}

const SettingsSheet: React.FC<SettingsSheetProps> = ({ open, onClose, settings, onSettingsChange, onReset }) => {
  return (
    <Sheet open={open} onClose={onClose} title="Configurações">
      <div className="space-y-6">
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

        <div className="border-t border-zinc-800 pt-4">
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
        
        <div className="border-t border-zinc-800 pt-4">
          <h4 className="text-sm font-medium mb-3">Dados</h4>
          <button onClick={onReset} className="px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white transition-colors">
            Resetar todos os dados
          </button>
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <h4 className="text-sm font-medium mb-2">Sobre</h4>
          <p className="text-xs text-zinc-400">Controle Financeiro Pro v1.1</p>
          <p className="text-xs text-zinc-400">Gerencie suas finanças com facilidade.</p>
        </div>
      </div>
    </Sheet>
  );
};

export default SettingsSheet;
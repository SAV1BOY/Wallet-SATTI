
import React from 'react';
import { SavingsGoal, Settings } from '../../types';
import { fmtMoney } from '../../utils/helpers';
import { IconEdit, IconPlus } from '../icons/Icon';

interface SavingsViewProps {
  savingsGoals: SavingsGoal[];
  settings: Settings;
  onNewGoal: () => void;
  onEditGoal: (goal: SavingsGoal) => void;
  onAddToGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (goal: SavingsGoal) => void;
}

const GoalCard: React.FC<{ goal: SavingsGoal; settings: Settings; onEdit: () => void; onDelete: () => void; onAdd: () => void; }> = ({ goal, settings, onEdit, onDelete, onAdd }) => {
  const progress = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
  const isComplete = goal.savedAmount >= goal.targetAmount;

  return (
    <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-lg">{goal.name}</h4>
          {goal.targetDate && <p className="text-xs text-zinc-400">Meta para: {new Date(goal.targetDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"><IconEdit size={18} /></button>
          <button onClick={onDelete} className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-rose-400">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
          </button>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-baseline text-sm mb-1">
          <span className={`${isComplete ? 'text-emerald-400' : 'text-zinc-200'}`}>{fmtMoney(goal.savedAmount, settings.currency)}</span>
          <span className="text-zinc-400">de {fmtMoney(goal.targetAmount, settings.currency)}</span>
        </div>
        <div className="w-full bg-zinc-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-cyan-500'}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <div className="text-right text-xs mt-1 text-zinc-400">{progress.toFixed(1)}%</div>
      </div>

      {!isComplete && (
        <button onClick={onAdd} className="w-full py-2 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/40 border border-cyan-500/50 transition-colors">
          Adicionar Dinheiro
        </button>
      )}
      {isComplete && (
        <div className="text-center py-2 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/50">
          🎉 Meta Atingida!
        </div>
      )}
    </div>
  );
};


const SavingsView: React.FC<SavingsViewProps> = ({ savingsGoals, settings, onNewGoal, onEditGoal, onAddToGoal, onDeleteGoal }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-zinc-100">Minhas Metas</h3>
          <button onClick={onNewGoal} className="flex items-center gap-2 text-sm bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded-lg transition-colors">
              <IconPlus size={16} />
              Nova Meta
          </button>
      </div>

      {savingsGoals.length === 0 ? (
        <div className="text-center py-20 text-zinc-400 border-2 border-dashed border-zinc-800 rounded-2xl">
          <p className="text-5xl mb-4">🐷</p>
          <p className="mb-6">Você ainda não tem nenhuma meta de poupança.</p>
          <button onClick={onNewGoal} className="mx-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors">
            Criar minha primeira meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsGoals.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              settings={settings}
              onAdd={() => onAddToGoal(goal)}
              onEdit={() => onEditGoal(goal)}
              onDelete={() => onDeleteGoal(goal)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavingsView;

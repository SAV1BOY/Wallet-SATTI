
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppData, Occurrence, Entry, Tab, Action, Budget, SavingsGoal, Category, Kind } from './types';
import { getInitialData, getAllOccurrences, getEmptyData } from './services/financeService';
import { addMonthsSafe, monthLabel, uid, pad, dateISO, storage } from './utils/helpers';

import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import DashboardView from './components/views/DashboardView';
import TransactionsView from './components/views/TransactionsView';
import ReportsView from './components/views/ReportsView';
import BudgetsView from './components/views/BudgetsView';
import SettingsView from './components/views/SettingsView';
import SavingsView from './components/views/SavingsView';
import NewEntryModal from './components/entry/NewEntryModal';
import EditEntryModal from './components/entry/EditEntryModal';
import EntryDetailSheet from './components/entry/EntryDetailSheet';
import ConfirmModal from './components/ui/ConfirmModal';
import EditBudgetsModal from './components/budget/EditBudgetsModal';
import GoalModal from './components/savings/GoalModal';
import AddToSavingsModal from './components/savings/AddToSavingsModal';
import CategoryModal from './components/settings/CategoryModal';
import OnboardingModal from './components/onboarding/OnboardingModal';


export default function App() {
  const [data, setData] = useState<AppData>(() => {
    try {
      const raw = storage.getItem('finapp-data');
      if (raw) {
        const parsed = JSON.parse(raw);
        // Migration for users without categories data
        if (!parsed.categories || parsed.categories.receita.length === 0) {
          return { ...parsed, categories: getInitialData().categories };
        }
        return parsed;
      }
      return getInitialData();
    } catch {
      return getInitialData();
    }
  });

  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [showNew, setShowNew] = useState(false);
  const [showEditBudgets, setShowEditBudgets] = useState(false);
  const [detail, setDetail] = useState<Occurrence | null>(null);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [confirmAction, setConfirmAction] = useState<Action | null>(null);

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [addingToGoal, setAddingToGoal] = useState<SavingsGoal | null>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ category: Category; kind: Kind } | null>(null);
  const [categoryKindToAdd, setCategoryKindToAdd] = useState<Kind | null>(null);
  
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboardingComplete = storage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    try {
      storage.setItem('finapp-data', JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }, [data]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !!data.settings?.dark);
  }, [data.settings?.dark]);

  const allOccurrences = useMemo(() => getAllOccurrences(data.entries, 120), [data.entries]);

  const handleSaveEntry = (entry: Omit<Entry, 'id' | 'createdAt'>) => {
    setData((d) => ({ ...d, entries: [...d.entries, { ...entry, id: uid(), createdAt: new Date().toISOString() }] }));
    setShowNew(false);
  };
  
  const handleApplyEdit = (entry: Entry) => {
    setData(d => ({ ...d, entries: d.entries.map(e => e.id === entry.id ? entry : e) }));
    setEditing(null);
    setDetail(null);
  };
  
  const handleSaveBudgets = (newBudgetsForMonth: Omit<Budget, 'month'>[]) => {
    const currentMonthStr = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}`;
    setData(d => {
        const otherMonthsBudgets = d.budgets.filter(b => b.month !== currentMonthStr);
        const newBudgets = newBudgetsForMonth
            .filter(b => b.amount > 0)
            .map(b => ({ ...b, month: currentMonthStr }));
        return { ...d, budgets: [...otherMonthsBudgets, ...newBudgets] };
    });
    setShowEditBudgets(false);
  };

  const handleSaveGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt' | 'savedAmount'> & { id?: string }) => {
    setData(d => {
      if (goalData.id) {
        const updatedGoals = d.savingsGoals.map(g => g.id === goalData.id ? { ...g, ...goalData } : g);
        return { ...d, savingsGoals: updatedGoals };
      } else {
        const newGoal: SavingsGoal = {
          ...goalData,
          id: uid(),
          createdAt: new Date().toISOString(),
          savedAmount: 0,
        };
        return { ...d, savingsGoals: [...(d.savingsGoals || []), newGoal] };
      }
    });
    setShowGoalModal(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    setData(d => ({ ...d, savingsGoals: d.savingsGoals.filter(g => g.id !== goalId) }));
  };

  const handleAddToSavings = ({ goalId, amount }: { goalId: string; amount: number }) => {
    if (amount <= 0) return;

    const goal = data.savingsGoals.find(g => g.id === goalId);
    if (!goal) return;

    setData(d => {
      const newEntry: Entry = {
        id: uid(),
        kind: 'despesa',
        description: `Aporte para meta: ${goal.name}`,
        value: amount,
        dueDate: dateISO(new Date()),
        recurrence: 'none',
        frequency: 'monthly',
        category: 'savings',
        createdAt: new Date().toISOString(),
      };
      const updatedGoals = d.savingsGoals.map(g =>
        g.id === goalId ? { ...g, savedAmount: g.savedAmount + amount } : g
      );
      return {
        ...d,
        entries: [...d.entries, newEntry],
        savingsGoals: updatedGoals,
      };
    });
    setAddingToGoal(null);
  };

  const handleTogglePaid = useCallback((occ: Occurrence) => {
    setData((d) => {
      const key = `paid:${occ.id}`;
      const next = { ...d.payments, [key]: !d.payments[key] };
      return { ...d, payments: next };
    });
  }, []);

  const handleDeleteEntry = useCallback((entryId: string) => {
    setData((d) => ({ ...d, entries: d.entries.filter((e) => e.id !== entryId) }));
    setDetail(null);
  }, []);

  const handleDeleteOccurrence = useCallback((occ: Occurrence) => {
    setData(d => ({ ...d, skips: { ...(d.skips || {}), [occ.id]: true } }));
    setDetail(null);
  }, []);

  const handleEndSeries = useCallback((occ: Occurrence) => {
    setData(d => {
      const idx = d.entries.findIndex(e => e.id === occ.entryId);
      if (idx === -1) return d;
      const entry = d.entries[idx];
      let updated = entry;
      if (entry.recurrence === 'always') {
        updated = { ...entry, untilDate: occ.dueDate };
      } else if (entry.recurrence === 'parcelado') {
        const newParcels = Math.max(1, occ.occIndex || 1);
        updated = { ...entry, parcels: newParcels };
      } else {
        return d;
      }
      const nextEntries = d.entries.slice();
      nextEntries[idx] = updated;
      return { ...d, entries: nextEntries };
    });
    setDetail(null);
  }, []);
  
  const handleResetData = useCallback(() => {
    setData(d => {
      const emptyData = getEmptyData();
      return {
        ...emptyData,
        settings: d.settings,
        categories: getInitialData().categories,
      };
    });
  }, []);
  
  const handleSaveCategory = (categoryData: Omit<Category, 'id'> & { id?: string }) => {
    const kind = editingCategory?.kind || categoryKindToAdd;
    if (!kind) return;

    if (!categoryData.label.trim() || !categoryData.icon.trim()) {
      alert("Nome da Categoria e Ícone são obrigatórios.");
      return;
    }

    setData(d => {
      const newCategoriesForKind = [...d.categories[kind]];
      if (categoryData.id) { // Editing
        const index = newCategoriesForKind.findIndex(c => c.id === categoryData.id);
        if (index > -1) newCategoriesForKind[index] = { ...newCategoriesForKind[index], ...categoryData };
      } else { // Creating
        const newCategory: Category = {
          ...categoryData,
          id: (categoryData.label.toLowerCase().replace(/[^a-z0-9]/g, '_') + `_${uid().slice(0, 4)}`),
        };
        newCategoriesForKind.push(newCategory);
      }
      return { ...d, categories: { ...d.categories, [kind]: newCategoriesForKind } };
    });
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryKindToAdd(null);
  };

  const handleDeleteCategory = ({ categoryId, kind }: { categoryId: string, kind: Kind }) => {
    setData(d => {
      if (['other_income', 'other_expense'].includes(categoryId)) return d; // Cannot delete default
      
      const defaultCategoryId = kind === 'receita' ? 'other_income' : 'other_expense';
      const updatedEntries = d.entries.map(entry => 
        entry.category === categoryId ? { ...entry, category: defaultCategoryId } : entry
      );
      const updatedBudgets = d.budgets.filter(b => b.categoryId !== categoryId);
      const updatedCategoriesForKind = d.categories[kind].filter(c => c.id !== categoryId);
      
      return { 
        ...d,
        entries: updatedEntries,
        budgets: updatedBudgets,
        categories: { ...d.categories, [kind]: updatedCategoriesForKind }
      };
    });
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'deleteEntry') handleDeleteEntry(confirmAction.payload);
    if (confirmAction.type === 'deleteOccurrence') handleDeleteOccurrence(confirmAction.payload);
    if (confirmAction.type === 'endSeries') handleEndSeries(confirmAction.payload);
    if (confirmAction.type === 'deleteGoal') handleDeleteGoal(confirmAction.payload);
    if (confirmAction.type === 'reset') handleResetData();
    if (confirmAction.type === 'deleteCategory') handleDeleteCategory(confirmAction.payload);
    setConfirmAction(null);
  };
  
  const handleEditRequest = (occ: Occurrence) => {
      const entryToEdit = data.entries.find(e => e.id === occ.entryId);
      if (entryToEdit) {
          setEditing(entryToEdit);
      }
  };

  const handleOnboardingComplete = () => {
    storage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-28">
      <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
      
      {activeTab === 'settings' || activeTab === 'reports' ? (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center">
              <div className="text-lg text-zinc-800 dark:text-zinc-200 font-medium select-none">{activeTab === 'settings' ? 'Configurações' : 'Relatórios'}</div>
          </div>
        </header>
      ) : (
        <Header
          title={monthLabel(cursor)}
          onPrev={() => setCursor(c => addMonthsSafe(c, -1))}
          onNext={() => setCursor(c => addMonthsSafe(c, 1))}
        />
      )}

      <main className="max-w-4xl mx-auto px-4 pt-3">
        {activeTab === 'dashboard' && <DashboardView allOccurrences={allOccurrences} cursor={cursor} skips={data.skips || {}} settings={data.settings} categories={data.categories} />}
        {activeTab === 'transactions' && <TransactionsView allOccurrences={allOccurrences} cursor={cursor} data={data} onSelect={setDetail} onAdd={() => setShowNew(true)} settings={data.settings} onTogglePaid={handleTogglePaid} categories={data.categories} />}
        {activeTab === 'savings' && 
            <SavingsView 
                savingsGoals={data.savingsGoals || []}
                settings={data.settings}
                onNewGoal={() => { setEditingGoal(null); setShowGoalModal(true); }}
                onEditGoal={(goal) => { setEditingGoal(goal); setShowGoalModal(true); }}
                onAddToGoal={setAddingToGoal}
                onDeleteGoal={(goal) => setConfirmAction({ type: 'deleteGoal', title: 'Excluir Meta', payload: goal.id, message: `Tem certeza que deseja excluir a meta "${goal.name}"?` })}
            />
        }
        {activeTab === 'budgets' && <BudgetsView allOccurrences={allOccurrences} cursor={cursor} data={data} onEdit={() => setShowEditBudgets(true)} settings={data.settings} categories={data.categories} />}
        {activeTab === 'reports' && <ReportsView allOccurrences={allOccurrences} cursor={cursor} setCursor={setCursor} data={data} settings={data.settings} categories={data.categories} />}
        {activeTab === 'settings' && 
            <SettingsView 
                settings={data.settings}
                categories={data.categories}
                onSettingsChange={(newSettings) => setData(d => ({ ...d, settings: newSettings }))}
                onReset={() => setConfirmAction({ type: 'reset', title: 'Resetar Dados do Aplicativo', message: 'Tem certeza que deseja resetar todos os dados? Isso apagará TODOS os lançamentos, orçamentos e metas. Esta ação não pode ser desfeita.' })}
                onAddCategory={(kind) => { setCategoryKindToAdd(kind); setEditingCategory(null); setShowCategoryModal(true); }}
                onEditCategory={(category, kind) => { setEditingCategory({ category, kind }); setCategoryKindToAdd(null); setShowCategoryModal(true); }}
                onDeleteCategory={(category, kind) => {
                  if (['other_income', 'other_expense'].includes(category.id)) {
                    alert('Não é possível excluir a categoria padrão "Outros".');
                    return;
                  }
                  setConfirmAction({ type: 'deleteCategory', payload: { categoryId: category.id, kind }, title: 'Excluir Categoria', message: `Tem certeza que deseja excluir a categoria "${category.label}"? Lançamentos existentes nesta categoria serão movidos para "Outros".`})
                }}
            />
        }
      </main>
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onAdd={() => setShowNew(true)} />

      <NewEntryModal open={showNew} onClose={() => setShowNew(false)} onSave={handleSaveEntry} categories={data.categories} />
      
      {editing && (<EditEntryModal open={!!editing} onClose={() => setEditing(null)} initial={editing} onSave={handleApplyEdit} categories={data.categories} />)}

      <EntryDetailSheet 
        detail={detail} 
        data={data}
        onClose={() => setDetail(null)} 
        onTogglePaid={handleTogglePaid}
        onEditRequest={handleEditRequest}
        onConfirmAction={setConfirmAction}
        settings={data.settings}
        categories={data.categories}
      />

      <EditBudgetsModal
        open={showEditBudgets}
        onClose={() => setShowEditBudgets(false)}
        onSave={handleSaveBudgets}
        cursor={cursor}
        budgets={data.budgets}
        categories={data.categories}
      />

      <GoalModal
        open={showGoalModal}
        onClose={() => { setShowGoalModal(false); setEditingGoal(null); }}
        onSave={handleSaveGoal}
        initial={editingGoal}
      />

      <AddToSavingsModal
        open={!!addingToGoal}
        onClose={() => setAddingToGoal(null)}
        onSave={handleAddToSavings}
        goal={addingToGoal}
      />

      <CategoryModal 
        open={showCategoryModal}
        onClose={() => { setShowCategoryModal(false); setEditingCategory(null); setCategoryKindToAdd(null); }}
        onSave={handleSaveCategory}
        initial={editingCategory?.category || null}
      />
      
      <ConfirmModal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction?.title || "Confirmar Ação"}
        onConfirm={handleConfirm}>
        {confirmAction?.message}
      </ConfirmModal>
    </div>
  );
}

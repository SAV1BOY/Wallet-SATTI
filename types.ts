
export type Kind = 'receita' | 'despesa';

export type Recurrence = 'none' | 'always' | 'parcelado';

export type Frequency = 'monthly' | '6m' | 'yearly';

export type Tab = 'dashboard' | 'transactions' | 'savings' | 'reports' | 'budgets' | 'settings';

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const CURRENCIES = ['BRL', 'USD', 'EUR'] as const;
export type Currency = typeof CURRENCIES[number];

export interface Entry {
  id: string;
  kind: Kind;
  description: string;
  value: number;
  dueDate: string; // YYYY-MM-DD
  recurrence: Recurrence;
  frequency: Frequency;
  parcels?: number;
  untilDate?: string; // YYYY-MM-DD
  category: string;
  createdAt: string; // ISO String
}

export interface Occurrence {
  id: string;
  entryId: string;
  kind: Kind;
  description: string;
  value: number;
  dueDate: string; // YYYY-MM-DD
  occIndex?: number;
  occTotal?: number;
  type: Recurrence;
  category: string;
}

export interface PaymentData {
  [key: string]: boolean;
}

export interface SkipData {
  [key: string]: boolean;
}

export interface Settings {
  dark: boolean;
  email: string;
  currency: Currency;
}

export interface Budget {
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string; // YYYY-MM-DD
  createdAt: string; // ISO String
}

export interface AppData {
  entries: Entry[];
  payments: PaymentData;
  skips: SkipData;
  settings: Settings;
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  categories: {
    receita: Category[];
    despesa: Category[];
  };
}

export interface Action {
  type: 'deleteEntry' | 'deleteOccurrence' | 'endSeries' | 'reset' | 'deleteGoal' | 'deleteCategory';
  payload?: any;
  title?: string;
  message: string;
}
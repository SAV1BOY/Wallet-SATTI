
import { Category, Currency } from './types';

export const CURRENCY_OPTIONS: { id: Currency, label: string }[] = [
  { id: 'BRL', label: 'Real Brasileiro (BRL)' },
  { id: 'USD', label: 'Dólar Americano (USD)' },
  { id: 'EUR', label: 'Euro (EUR)' },
];

export const DEFAULT_CATEGORIES: { receita: Category[], despesa: Category[] } = {
  receita: [
    { id: 'salary', label: 'Salário', icon: '💼', color: '#10b981' },
    { id: 'freelance', label: 'Freelance', icon: '💻', color: '#059669' },
    { id: 'business', label: 'Negócios', icon: '🏢', color: '#047857' },
    { id: 'investment', label: 'Investimentos', icon: '📈', color: '#065f46' },
    { id: 'other_income', label: 'Outros', icon: '💰', color: '#6b7280' }
  ],
  despesa: [
    { id: 'food', label: 'Alimentação', icon: '🍽️', color: '#ef4444' },
    { id: 'transport', label: 'Transporte', icon: '🚗', color: '#f97316' },
    { id: 'housing', label: 'Moradia', icon: '🏠', color: '#eab308' },
    { id: 'health', label: 'Saúde', icon: '🏥', color: '#ec4899' },
    { id: 'education', label: 'Educação', icon: '📚', color: '#8b5cf6' },
    { id: 'entertainment', label: 'Lazer', icon: '🎬', color: '#06b6d4' },
    { id: 'savings', label: 'Poupança', icon: '🐷', color: '#a855f7' },
    { id: 'business_exp', label: 'Despesas Empresariais', icon: '📊', color: '#dc2626' },
    { id: 'tax', label: 'Impostos', icon: '🧾', color: '#991b1b' },
    { id: 'other_expense', label: 'Outros', icon: '💸', color: '#6b7280' }
  ]
};
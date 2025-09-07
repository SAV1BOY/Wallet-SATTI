
import { Category, Currency, Language } from './types';

export const CURRENCY_OPTIONS: { id: Currency, label: string }[] = [
  { id: 'BRL', label: 'Real Brasileiro (BRL)' },
  { id: 'USD', label: 'Dólar Americano (USD)' },
  { id: 'EUR', label: 'Euro (EUR)' },
  { id: 'GBP', label: 'Libra Esterlina (GBP)' },
  { id: 'RUB', label: 'Rublo Russo (RUB)' },
  { id: 'ARS', label: 'Peso Argentino (ARS)' },
  { id: 'JPY', label: 'Iene Japonês (JPY)' },
  { id: 'CAD', label: 'Dólar Canadense (CAD)' },
];

export const LANGUAGE_OPTIONS: { id: Language, label: string }[] = [
    { id: 'pt', label: 'Português (Brasil)' },
    { id: 'en', label: 'English (US)' },
    { id: 'es', label: 'Español (España)' },
];

export const DEFAULT_CATEGORIES: { receita: Category[], despesa: Category[] } = {
  receita: [
    { id: 'salary', label: 'Salário', icon: '💼', color: '#22c55e' },
    { id: 'freelance', label: 'Freelance', icon: '💻', color: '#3b82f6' },
    { id: 'business', label: 'Negócios', icon: '🏢', color: '#8b5cf6' },
    { id: 'investment', label: 'Investimentos', icon: '📈', color: '#0ea5e9' },
    { id: 'other_income', label: 'Outros', icon: '💰', color: '#64748b' }
  ],
  despesa: [
    { id: 'food', label: 'Alimentação', icon: '🍽️', color: '#ef4444' },
    { id: 'transport', label: 'Transporte', icon: '🚗', color: '#f97316' },
    { id: 'housing', label: 'Moradia', icon: '🏠', color: '#eab308' },
    { id: 'health', label: 'Saúde', icon: '🏥', color: '#ec4899' },
    { id: 'education', label: 'Educação', icon: '📚', color: '#8b5cf6' },
    { id: 'entertainment', label: 'Lazer', icon: '🎬', color: '#06b6d4' },
    { id: 'savings', label: 'Poupança', icon: '🐷', color: '#14b8a6' },
    { id: 'business_exp', label: 'Despesas Empresariais', icon: '📊', color: '#6366f1' },
    { id: 'tax', label: 'Impostos', icon: '🧾', color: '#d946ef' },
    { id: 'other_expense', label: 'Outros', icon: '💸', color: '#64748b' }
  ]
};

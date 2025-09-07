import { Currency } from '../types';

export const LOCALE_MAP: { [key: string]: string } = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES'
};

const CURRENCY_FORMATTERS: { [key: string]: Intl.NumberFormat } = {};

export const fmtMoney = (n: number, currency: Currency = 'BRL', lang: string = 'pt') => {
    const locale = LOCALE_MAP[lang] || 'pt-BR';
    const formatterKey = `${locale}_${currency}`;
    
    if (!CURRENCY_FORMATTERS[formatterKey]) {
        CURRENCY_FORMATTERS[formatterKey] = new Intl.NumberFormat(locale, { style: "currency", currency: currency });
    }
    const formatter = CURRENCY_FORMATTERS[formatterKey];
    return formatter.format(n || 0);
};

export const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const isSameYM = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const monthLabel = (d: Date, lang: string = 'pt') => {
    const locale = LOCALE_MAP[lang] || 'pt-BR';
    return d.toLocaleDateString(locale, { month: "long", year: "numeric", timeZone: 'UTC' });
};

export const shortMonthLabel = (d: Date, lang: string = 'pt') => {
    const locale = LOCALE_MAP[lang] || 'pt-BR';
    return d.toLocaleDateString(locale, { month: "short", timeZone: 'UTC' });
};

export const dateISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseDate = (s: string) => {
  const [y, m, d] = String(s).split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const uid = () => globalThis.crypto?.randomUUID?.() || (Math.random().toString(36).slice(2) + Date.now());

export function addMonthsSafe(date: Date, m: number): Date {
  const d = new Date(date.getTime());
  const targetMonth = d.getMonth() + m;
  const year = d.getFullYear() + Math.floor(targetMonth / 12);
  const month = ((targetMonth % 12) + 12) % 12;
  const end = new Date(year, month + 1, 0).getDate();
  const day = Math.min(d.getDate(), end);
  return new Date(year, month, day);
}

export function overdueStatus(isoDate: string): 'overdue' | 'ontime' {
  const due = parseDate(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today ? "overdue" : "ontime";
}

export const storage = {
  getItem: function(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error("Failed to read from localStorage:", e);
      return null;
    }
  },
  setItem: function(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error("Failed to write to localStorage:", e);
    }
  }
};

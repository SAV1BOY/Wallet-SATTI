
import { Currency } from '../types';

const CURRENCY_FORMATTERS: { [key in Currency]: Intl.NumberFormat } = {
  BRL: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  EUR: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }),
};

export const fmtMoney = (n: number, currency: Currency = 'BRL') => {
    const formatter = CURRENCY_FORMATTERS[currency] || CURRENCY_FORMATTERS.BRL;
    return formatter.format(n || 0);
};

export const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const isSameYM = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
export const monthLabel = (d: Date) => d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
export const shortMonthLabel = (d: Date) => d.toLocaleDateString("pt-BR", { month: "short" });
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
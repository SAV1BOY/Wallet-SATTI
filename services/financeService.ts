
import { Entry, Occurrence, Frequency, AppData } from '../types';
import { parseDate, addMonthsSafe, dateISO, pad } from '../utils/helpers';
import { DEFAULT_CATEGORIES } from '../constants';

export function getInitialData(): AppData {
  const now = new Date();
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const monthStr = `${year}-${month}`;

  return {
    entries: [
      {
        id: 'sample-salary', kind: 'receita', description: 'Salário', value: 7500,
        dueDate: `${year}-${month}-05`, recurrence: 'always', frequency: 'monthly',
        category: 'salary', createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'sample-rent', kind: 'despesa', description: 'Aluguel', value: 1500,
        dueDate: `${year}-${month}-10`, recurrence: 'always', frequency: 'monthly',
        category: 'housing', createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'sample-groceries', kind: 'despesa', description: 'Supermercado', value: 1200,
        dueDate: `${year}-${month}-01`, recurrence: 'always', frequency: 'monthly',
        category: 'food', createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'sample-credit-card', kind: 'despesa', description: 'Cartão de Crédito', value: 2000,
        dueDate: `${year}-${month}-10`, recurrence: 'always', frequency: 'monthly',
        category: 'other_expense', createdAt: '2024-01-01T00:00:00.000Z'
      }
    ],
    payments: {},
    skips: {},
    settings: { dark: true, email: "", currency: "BRL" },
    budgets: [
      { categoryId: 'food', amount: 1000, month: monthStr },
      { categoryId: 'transport', amount: 300, month: monthStr },
      { categoryId: 'entertainment', amount: 250, month: monthStr },
      { categoryId: 'housing', amount: 2500, month: monthStr },
    ],
    savingsGoals: [],
    categories: DEFAULT_CATEGORIES,
  };
}

export function getEmptyData(): AppData {
  return {
    entries: [],
    payments: {},
    skips: {},
    settings: { dark: true, email: "", currency: "BRL" },
    budgets: [],
    savingsGoals: [],
    categories: { receita: [], despesa: [] },
  };
}

const freqToMonths = (f: Frequency) => (f === "6m" ? 6 : f === "yearly" ? 12 : 1);

export function getAllOccurrences(entries: Entry[], futureLimitInMonths = 60): Occurrence[] {
  const allOccurrences: Occurrence[] = [];
  const futureDateLimit = addMonthsSafe(new Date(), futureLimitInMonths);

  for (const entry of entries) {
    const startDate = parseDate(entry.dueDate);
    const untilDate = entry.untilDate ? parseDate(entry.untilDate) : null;
    const interval = freqToMonths(entry.frequency || "monthly");
    const category = entry.category || (entry.kind === 'receita' ? 'other_income' : 'other_expense');

    const createOccurrence = (date: Date, index?: number, total?: number): Occurrence => ({
      id: `${entry.id}_${date.getFullYear()}${pad(date.getMonth() + 1)}_${pad(date.getDate())}`,
      entryId: entry.id,
      kind: entry.kind,
      description: entry.description,
      value: entry.value,
      dueDate: dateISO(date),
      occIndex: index,
      occTotal: total,
      type: entry.recurrence,
      category: category
    });

    if (entry.recurrence === 'none') {
      if (!untilDate || startDate <= untilDate) {
        allOccurrences.push(createOccurrence(startDate, 1, 1));
      }
    } else if (entry.recurrence === 'parcelado') {
      const total = Math.max(1, entry.parcels || 1);
      for (let i = 0; i < total; i++) {
        const currentDate = addMonthsSafe(startDate, interval * i);
        if (untilDate && currentDate > untilDate) break;
        const desc = `${entry.description} (${i + 1}/${total})`;
        allOccurrences.push({
          ...createOccurrence(currentDate, i + 1, total),
          description: desc
        });
      }
    } else if (entry.recurrence === 'always') {
      let currentDate = new Date(startDate);
      const limit = untilDate || futureDateLimit;
      let i = 0;
      while (currentDate <= limit) {
        allOccurrences.push(createOccurrence(currentDate));
        i++;
        currentDate = addMonthsSafe(startDate, interval * i);
      }
    }
  }
  return allOccurrences;
}
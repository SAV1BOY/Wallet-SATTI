

import { Entry, Occurrence, Frequency, AppData } from '../types';
import { parseDate, addMonthsSafe, dateISO, pad } from '../utils/helpers';
import { DEFAULT_CATEGORIES } from '../constants';

export function getInitialData(): AppData {
  return {
    entries: [],
    payments: {},
    skips: {},
    settings: { dark: true, email: "", currency: "BRL" },
    budgets: [],
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


import React, { useMemo, useState } from 'react';
import { AppData, Occurrence, Settings, Category } from '../../types';
import { isSameYM, parseDate, fmtMoney, shortMonthLabel, monthLabel, overdueStatus, addMonthsSafe, LOCALE_MAP } from '../../utils/helpers';
import { IconDollar, IconChart, IconDownload } from '../icons/Icon';
import Chip from '../ui/Chip';
import { useLanguage } from '../LanguageProvider';

type Period = 'monthly' | 'quarterly' | 'yearly' | 'all';

interface ReportsViewProps {
  allOccurrences: Occurrence[];
  cursor: Date;
  setCursor: (date: Date) => void;
  data: AppData;
  settings: Settings;
  categories: { receita: Category[], despesa: Category[] };
}

const ReportsView: React.FC<ReportsViewProps> = ({ allOccurrences, cursor, setCursor, data, settings, categories }) => {
  const { t, locale } = useLanguage();
  const { skips, payments } = data;
  const [projectionYears, setProjectionYears] = useState(5);
  const [period, setPeriod] = useState<Period>('monthly');

  const { occurrences, periodLabel } = useMemo(() => {
    const filteredOccurrences = allOccurrences.filter(o => !skips?.[o.id]);

    if (period === 'all') {
        return { occurrences: filteredOccurrences, periodLabel: t('reports.allTime') };
    }
    if (period === 'yearly') {
        const year = cursor.getFullYear();
        return {
            occurrences: filteredOccurrences.filter(o => parseDate(o.dueDate).getFullYear() === year),
            periodLabel: t('reports.yearOf', { year })
        };
    }
    if (period === 'quarterly') {
        const year = cursor.getFullYear();
        const month = cursor.getMonth();
        const quarter = Math.floor(month / 3);
        const startMonth = quarter * 3;
        const endMonth = startMonth + 2;
        return {
            occurrences: filteredOccurrences.filter(o => {
                const d = parseDate(o.dueDate);
                return d.getFullYear() === year && d.getMonth() >= startMonth && d.getMonth() <= endMonth;
            }),
            periodLabel: t('reports.quarterOfYear', { quarter: quarter + 1, year })
        };
    }
    // monthly
    return {
        occurrences: filteredOccurrences.filter(o => isSameYM(parseDate(o.dueDate), cursor)),
        periodLabel: monthLabel(cursor, locale)
    };
  }, [allOccurrences, skips, cursor, period, t, locale]);

  const totals = useMemo(() => {
    let inc = 0, exp = 0;
    for (const oc of occurrences) {
      if (oc.kind === "receita") inc += oc.value; else exp += oc.value;
    }
    return { inc, exp, bal: inc - exp };
  }, [occurrences]);

  const { accumulatedBalance, accumulatedBalanceLabel } = useMemo(() => {
    let untilDate: Date;
    let label: string;

    if (period === 'all') {
        untilDate = new Date(8640000000000000); // Max Date
        label = t('reports.finalAccumulatedBalance');
    } else if (period === 'yearly') {
        untilDate = new Date(cursor.getFullYear(), 11, 31);
        label = t('reports.accumulatedToDate', { date: cursor.getFullYear() });
    } else if (period === 'quarterly') {
        const quarter = Math.floor(cursor.getMonth() / 3);
        const endMonth = quarter * 3 + 3;
        untilDate = new Date(cursor.getFullYear(), endMonth, 0);
        label = t('reports.accumulatedToQuarter', { quarter: quarter + 1, year: cursor.getFullYear() });
    } else { // monthly
        untilDate = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
        label = t('reports.accumulatedToDate', { date: shortMonthLabel(cursor, locale) });
    }

    const balance = allOccurrences
      .filter(o => parseDate(o.dueDate) <= untilDate && !skips?.[o.id])
      .reduce((acc, o) => acc + (o.kind === 'receita' ? o.value : -o.value), 0);
      
    return { accumulatedBalance: balance, accumulatedBalanceLabel: label };
  }, [allOccurrences, skips, cursor, period, t, locale]);
  

  const finalProjectedBalance = useMemo(() => {
    const projectionEndDate = addMonthsSafe(new Date(), projectionYears * 12);
    let balance = 0;
    allOccurrences
      .filter(o => !skips?.[o.id] && parseDate(o.dueDate) <= projectionEndDate)
      .forEach(o => {
        balance += o.kind === 'receita' ? o.value : -o.value;
      });
    return balance;
  }, [allOccurrences, skips, projectionYears]);

  const handleExportCSV = () => {
    const filename = `relatorio_financeiro_${periodLabel.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`;
    const headers = 'Data,Descrição,Categoria,Valor,Tipo\n';

    const escapeCsvField = (field: string) => {
      let value = String(field);
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };
    
    const csvRows = occurrences.map(occ => {
      const cat = categories[occ.kind].find(c => c.id === occ.category);
      const catKey = `categories.${occ.kind}.${cat?.id}`;
      const translatedCat = t(catKey);
      const categoryLabel = translatedCat === catKey ? cat?.label : translatedCat;
      const date = parseDate(occ.dueDate).toLocaleDateString(LOCALE_MAP[locale]);
      const description = escapeCsvField(occ.description);
      const value = occ.value.toFixed(2).replace('.', ',');
      const type = occ.kind === 'receita' ? t('common.income') : t('common.expenses');
      return [date, description, categoryLabel, value, type].join(',');
    }).join('\n');
    
    const csvContent = headers + csvRows;
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const projectionOptions = [1, 2, 5, 10];

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    allOccurrences.forEach(occ => years.add(parseDate(occ.dueDate).getFullYear()));
    if (years.size === 0) years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [allOccurrences]);

  const months = useMemo(() => {
    const date = new Date(2000, 0, 1);
    return Array.from({ length: 12 }, (_, i) => {
      date.setMonth(i);
      return { value: i, label: date.toLocaleString(LOCALE_MAP[locale], { month: 'long' }) };
    });
  }, [locale]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCursor(new Date(cursor.getFullYear(), parseInt(e.target.value, 10), 1));
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCursor(new Date(parseInt(e.target.value, 10), cursor.getMonth(), 1));

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{t('reports.periodFilter')}</h3>
        <div className="flex flex-wrap items-center gap-2 mb-4">
            <Chip active={period === 'monthly'} onClick={() => setPeriod('monthly')}>{t('reports.monthly')}</Chip>
            <Chip active={period === 'quarterly'} onClick={() => setPeriod('quarterly')}>{t('reports.quarterly')}</Chip>
            <Chip active={period === 'yearly'} onClick={() => setPeriod('yearly')}>{t('reports.yearly')}</Chip>
            <Chip active={period === 'all'} onClick={() => setPeriod('all')}>{t('reports.all')}</Chip>
        </div>
        {period === 'monthly' && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="month-select" className="text-sm text-zinc-500 dark:text-zinc-400 mb-1 block">{t('reports.month')}</label>
              <select id="month-select" value={cursor.getMonth()} onChange={handleMonthChange} className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500">
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[100px]">
              <label htmlFor="year-select" className="text-sm text-zinc-500 dark:text-zinc-400 mb-1 block">{t('reports.year')}</label>
              <select id="year-select" value={cursor.getFullYear()} onChange={handleYearChange} className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-cyan-500">
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t('reports.financialOverview')}</h3>
          <button onClick={handleExportCSV} className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors">
              <IconDownload size={16} />
              {t('reports.exportCSV')}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/80">
            <IconDollar size={32} className="mx-auto mb-2 text-cyan-600 dark:text-cyan-400" />
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{fmtMoney(accumulatedBalance, settings.currency, locale)}</div>
            <div className="text-sm text-cyan-500 dark:text-cyan-300">{accumulatedBalanceLabel}</div>
          </div>
          <div className="flex flex-col text-center p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/80">
            <div className="flex-grow">
              <IconChart size={32} className="mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{fmtMoney(finalProjectedBalance, settings.currency, locale)}</div>
              <div className="text-sm text-purple-500 dark:text-purple-300">{t('reports.projectedBalance', { years: projectionYears })}</div>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700/80">
                {projectionOptions.map(years => (
                    <Chip key={years} active={projectionYears === years} onClick={() => setProjectionYears(years)}>
                        {years}A
                    </Chip>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{t('reports.summaryFor', { period: periodLabel })}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{fmtMoney(totals.inc, settings.currency, locale)}</div>
            <div className="text-sm text-emerald-500 dark:text-emerald-300">{t('reports.totalIncome')}</div>
          </div>
          <div className="text-center p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800/30">
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{fmtMoney(totals.exp, settings.currency, locale)}</div>
            <div className="text-sm text-rose-500 dark:text-rose-300">{t('reports.totalExpenses')}</div>
          </div>
          <div className={`text-center p-4 rounded-xl border ${totals.bal >= 0 ? "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800/30" : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/30"}`}>
            <div className={`text-2xl font-bold ${totals.bal >= 0 ? "text-cyan-600 dark:text-cyan-400" : "text-orange-500 dark:text-orange-400"}`}>{fmtMoney(totals.bal, settings.currency, locale)}</div>
            <div className={`text-sm ${totals.bal >= 0 ? "text-cyan-500 dark:text-cyan-300" : "text-orange-400 dark:text-orange-300"}`}>{t('reports.periodBalance')}</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{t('reports.categoryBreakdown')}</h3>
        <div className="space-y-6">
          <CategoryBreakdown title={t('common.income')} kind="receita" totalKind={totals.inc} occurrences={occurrences} settings={settings} categories={categories.receita} />
          <CategoryBreakdown title={t('common.expenses')} kind="despesa" totalKind={totals.exp} occurrences={occurrences} settings={settings} categories={categories.despesa} />
        </div>
      </div>
      
      <PaymentStatusSection occurrences={occurrences} payments={payments} />

      <OverdueSection occurrences={occurrences} payments={payments} settings={settings} />
    </div>
  );
};

interface BreakdownProps {
    title: string;
    kind: 'receita' | 'despesa';
    totalKind: number;
    occurrences: Occurrence[];
    settings: Settings;
    categories: Category[];
}

const CategoryBreakdown: React.FC<BreakdownProps> = ({title, kind, totalKind, occurrences, settings, categories}) => {
  const { t, locale } = useLanguage();
  const breakdownData = useMemo(() => {
    return categories.map(cat => {
      const total = occurrences.filter(o => o.kind === kind && o.category === cat.id).reduce((sum, o) => sum + o.value, 0);
      if (total === 0) return null;

      const key = `categories.${kind}.${cat.id}`;
      const translated = t(key);
      const label = translated === key ? cat.label : translated;

      const percentage = totalKind > 0 ? (total / totalKind) * 100 : 0;
      return { ...cat, label, total, percentage };
    }).filter((item): item is NonNullable<typeof item> => item !== null).sort((a,b) => b.total - a.total);
  }, [categories, occurrences, kind, totalKind, t]);

  if (breakdownData.length === 0) {
    return (
      <div>
        <h4 className={`text-sm font-medium mb-3 ${kind === 'receita' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{title}</h4>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('reports.noEntriesForPeriod')}</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className={`text-sm font-medium mb-3 ${kind === 'receita' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{title}</h4>
      <div className="space-y-2">
        {breakdownData.map(cat => (
          <div key={cat.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{cat.icon}</span>
              <span className="text-sm text-zinc-800 dark:text-zinc-200">{cat.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-zinc-500 dark:text-zinc-400 w-12 text-right">{cat.percentage.toFixed(1)}%</div>
              <div className="font-medium w-24 text-right text-zinc-900 dark:text-zinc-100">{fmtMoney(cat.total, settings.currency, locale)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

const PaymentStatusSection: React.FC<{occurrences: Occurrence[], payments: AppData['payments']}> = ({occurrences, payments}) => {
    const { t } = useLanguage();
    const paidCount = occurrences.filter(o => payments[`paid:${o.id}`]).length;
    const pendingCount = occurrences.length - paidCount;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{t('reports.paymentStatus')}</h3>
            <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{paidCount}</div>
                <div className="text-sm text-emerald-500 dark:text-emerald-300">{t('reports.paid')}</div>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</div>
                <div className="text-sm text-amber-500 dark:text-amber-300">{t('reports.pending')}</div>
            </div>
            </div>
      </div>
    );
};


const OverdueSection: React.FC<{occurrences: Occurrence[], payments: AppData['payments'], settings: Settings}> = ({occurrences, payments, settings}) => {
    const { t, locale } = useLanguage();
    const overdue = occurrences.filter(o => overdueStatus(o.dueDate) === 'overdue' && !payments[`paid:${o.id}`]);
    if (overdue.length === 0) return null;
    return (
      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4 border border-rose-200 dark:border-rose-800/30">
        <h3 className="text-lg font-semibold mb-4 text-rose-600 dark:text-rose-400">{t('reports.overdueEntries')}</h3>
        <div className="space-y-2">
          {overdue.map(o => {
            const daysOverdue = Math.floor((new Date().getTime() - parseDate(o.dueDate).getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div key={o.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-zinc-800 dark:text-zinc-200">{o.description}</div>
                  <div className="text-xs text-rose-500 dark:text-rose-400">{t('reports.overdueByDays', { days: daysOverdue })}</div>
                </div>
                <div className="font-semibold text-rose-600 dark:text-rose-400">{fmtMoney(o.value, settings.currency, locale)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
};


export default ReportsView;

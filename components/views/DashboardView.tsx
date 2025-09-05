
import React, { useMemo } from 'react';
import { Occurrence, Settings, SkipData, Category } from '../../types';
import { isSameYM, parseDate, fmtMoney } from '../../utils/helpers';
import MonthBarChart from '../charts/MonthBarChart';
import MonthlyTrendChart from '../charts/MonthlyTrendChart';
import CategoryPieChart from '../charts/CategoryPieChart';
import AccumulatedBalanceChart from '../charts/AccumulatedBalanceChart';

interface DashboardViewProps {
  allOccurrences: Occurrence[];
  cursor: Date;
  skips: SkipData;
  settings: Settings;
  categories: { receita: Category[], despesa: Category[] };
}

const DashboardView: React.FC<DashboardViewProps> = ({ allOccurrences, cursor, skips, settings, categories }) => {
  const occurrences = useMemo(() => {
    return allOccurrences
      .filter(o => isSameYM(parseDate(o.dueDate), cursor))
      .filter(o => !skips[o.id]);
  }, [allOccurrences, skips, cursor]);

  const totals = useMemo(() => {
    let inc = 0, exp = 0;
    for (const oc of occurrences) {
      if (oc.kind === "receita") inc += oc.value; else exp += oc.value;
    }
    return { inc, exp, bal: inc - exp };
  }, [occurrences]);

  const accumulatedBalance = useMemo(() => {
    const untilCursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    let balance = 0;
    allOccurrences
      .filter(o => parseDate(o.dueDate) <= untilCursor && !skips[o.id])
      .forEach(o => {
        balance += o.kind === 'receita' ? o.value : -o.value;
      });
    return balance;
  }, [allOccurrences, skips, cursor]);

  const finalProjectedBalance = useMemo(() => {
    let balance = 0;
    allOccurrences
      .filter(o => !skips[o.id])
      .forEach(o => {
        balance += o.kind === 'receita' ? o.value : -o.value;
      });
    return balance;
  }, [allOccurrences, skips]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <div className="text-sm text-zinc-400 mb-1">Balanço do mês</div>
        <div className="text-3xl font-bold my-1">{fmtMoney(totals.bal, settings.currency)}</div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div className="text-sm text-emerald-400">Receitas</div>
            <div className="font-semibold">{fmtMoney(totals.inc, settings.currency)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-rose-400">Despesas</div>
            <div className="font-semibold">{fmtMoney(totals.exp, settings.currency)}</div>
          </div>
        </div>
        <div className="border-t border-zinc-800 my-4" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-zinc-400">Saldo Acumulado</div>
            <div className="text-lg font-semibold text-cyan-400">{fmtMoney(accumulatedBalance, settings.currency)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-400">Projeção Final</div>
            <div className="text-lg font-semibold text-purple-400">{fmtMoney(finalProjectedBalance, settings.currency)}</div>
          </div>
        </div>
      </div>

      <MonthBarChart totalIn={totals.inc} totalOut={totals.exp} settings={settings} />
      <MonthlyTrendChart allOccurrences={allOccurrences} skips={skips} settings={settings} cursor={cursor} />
      <AccumulatedBalanceChart allOccurrences={allOccurrences} skips={skips} settings={settings} cursor={cursor} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryPieChart occurrences={occurrences} kind="receita" settings={settings} categories={categories} />
        <CategoryPieChart occurrences={occurrences} kind="despesa" settings={settings} categories={categories} />
      </div>
    </div>
  );
};

export default DashboardView;
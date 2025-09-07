
import React, { useMemo } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Occurrence, Settings, SkipData } from '../../types';
import { addMonthsSafe, parseDate, isSameYM, shortMonthLabel, fmtMoney } from '../../utils/helpers';
import { useLanguage } from '../LanguageProvider';

interface MonthlyTrendChartProps {
  allOccurrences: Occurrence[];
  skips: SkipData;
  settings: Settings;
  cursor: Date;
  months?: number;
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ allOccurrences, skips, settings, cursor, months = 6 }) => {
  const { t, locale } = useLanguage();

  const data = useMemo(() => {
    const chartData = [];
    const occurrencesToConsider = allOccurrences.filter(occ => !skips[occ.id]);

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = addMonthsSafe(cursor, -i);
      
      const monthOccurrences = occurrencesToConsider.filter(occ => {
        const occDate = parseDate(occ.dueDate);
        return isSameYM(occDate, monthDate);
      });

      let income = 0, expenses = 0;
      monthOccurrences.forEach(occ => {
        if (occ.kind === 'receita') income += occ.value; else expenses += occ.value;
      });
      
      const monthBalance = income - expenses;

      chartData.push({ 
        month: shortMonthLabel(monthDate, locale), 
        income, 
        expenses, 
        balance: monthBalance,
      });
    }
    return chartData;
  }, [allOccurrences, months, skips, cursor, locale]);

  const tooltipContentStyle = {
    backgroundColor: settings.dark ? '#18181b' : '#ffffff',
    border: `1px solid ${settings.dark ? '#3f3f46' : '#e4e4e7'}`,
    borderRadius: '0.5rem',
    color: settings.dark ? '#f4f4f5' : '#18181b',
  };
  const axisStrokeColor = settings.dark ? "#71717a" : "#a1a1aa";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{t('dashboard.monthlyFlow')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke={axisStrokeColor} fontSize={12} />
          <YAxis stroke={axisStrokeColor} fontSize={12} tickFormatter={(v: number) => fmtMoney(v, settings.currency, locale)} />
          <Tooltip contentStyle={tooltipContentStyle} formatter={(v: number, n: string) => [fmtMoney(v, settings.currency, locale), n]} cursor={{ stroke: axisStrokeColor, strokeDasharray: '3 3' }} />
          <Legend />
          <Area type="monotone" dataKey="income" stroke="#22c55e" fill="url(#colorReceitas)" name={t('charts.legend.income')} strokeWidth={2} activeDot={{ r: 6 }} />
          <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="url(#colorDespesas)" name={t('charts.legend.expenses')} strokeWidth={2} activeDot={{ r: 6 }} />
          <Area type="monotone" dataKey="balance" fill="url(#colorSaldo)" stroke="none" />
          <Line type="monotone" dataKey="balance" stroke="#3b82f6" name={t('charts.legend.balance')} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;

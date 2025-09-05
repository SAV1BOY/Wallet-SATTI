import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Occurrence, Settings, SkipData } from '../../types';
import { addMonthsSafe, parseDate, isSameYM, shortMonthLabel, fmtMoney } from '../../utils/helpers';

interface MonthlyTrendChartProps {
  allOccurrences: Occurrence[];
  skips: SkipData;
  settings: Settings;
  cursor: Date;
  months?: number;
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ allOccurrences, skips, settings, cursor, months = 6 }) => {
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
        month: shortMonthLabel(monthDate), 
        receitas: income, 
        despesas: expenses, 
        saldo: monthBalance,
      });
    }
    return chartData;
  }, [allOccurrences, months, skips, cursor]);

  return (
    <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100">Fluxo Mensal (Receitas x Despesas)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
          <YAxis stroke="#71717a" fontSize={12} tickFormatter={(v: number) => fmtMoney(v, settings.currency)} />
          <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, color: '#f4f4f5' }} formatter={(v: number, n: string) => [fmtMoney(v, settings.currency), n]} />
          <Legend />
          <Line type="monotone" dataKey="receitas" stroke="#10b981" name="Receitas" strokeWidth={2} />
          <Line type="monotone" dataKey="despesas" stroke="#ef4444" name="Despesas" strokeWidth={2} />
          <Line type="monotone" dataKey="saldo" stroke="#06b6d4" name="Saldo" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;
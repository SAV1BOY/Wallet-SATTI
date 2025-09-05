import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Occurrence, Settings, SkipData } from '../../types';
import { addMonthsSafe, parseDate, isSameYM, shortMonthLabel } from '../../utils/helpers';

interface BalanceVariationChartProps {
  allOccurrences: Occurrence[];
  skips: SkipData;
  settings: Settings;
  cursor: Date;
  months?: number;
}

const BalanceVariationChart: React.FC<BalanceVariationChartProps> = ({ allOccurrences, skips, settings, cursor, months = 6 }) => {
  const data = useMemo(() => {
    const balanceData = [];
    const occurrencesToConsider = allOccurrences.filter(occ => !skips[occ.id]);
    
    const firstMonthOfChart = addMonthsSafe(cursor, -(months - 1));
    const monthBeforeChart = addMonthsSafe(firstMonthOfChart, -1);
    monthBeforeChart.setDate(1);
    monthBeforeChart.setHours(0,0,0,0);
    
    let previousMonthBalance = occurrencesToConsider
      .filter(occ => parseDate(occ.dueDate) < monthBeforeChart)
      .reduce((acc, occ) => acc + (occ.kind === 'receita' ? occ.value : -occ.value), 0);
    
    let currentAccumulatedBalance = previousMonthBalance;

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = addMonthsSafe(cursor, -i);
      const monthOccurrences = occurrencesToConsider.filter(occ => isSameYM(parseDate(occ.dueDate), monthDate));
      const monthBalance = monthOccurrences.reduce((acc, occ) => acc + (occ.kind === 'receita' ? occ.value : -occ.value), 0);
      currentAccumulatedBalance += monthBalance;
      balanceData.push({ month: shortMonthLabel(monthDate), balance: currentAccumulatedBalance });
    }

    const variationData = [];
    for (let i = 0; i < balanceData.length; i++) {
        const currentBalance = balanceData[i].balance;
        const prevBalance = i > 0 ? balanceData[i-1].balance : previousMonthBalance;
        let variation = 0;

        if (prevBalance !== 0) {
            variation = ((currentBalance - prevBalance) / Math.abs(prevBalance)) * 100;
        } else if (currentBalance > 0) {
            variation = 100;
        }
        
        variationData.push({
            month: balanceData[i].month,
            'variação': variation
        });
    }

    return variationData;
  }, [allOccurrences, months, skips, cursor]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const color = value >= 0 ? 'text-emerald-400' : 'text-rose-400';
      return (
        <div className="bg-[#18181b] border border-[#3f3f46] rounded-lg p-3 text-sm">
          <p className="label text-zinc-400">{`${label}`}</p>
          <p className={`intro ${color}`}>{`Variação: ${value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100">Variação Mensal do Saldo (%)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
          <YAxis stroke="#71717a" fontSize={12} tickFormatter={(v: number) => `${v.toFixed(0)}%`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(113, 113, 122, 0.2)' }} />
          <Bar dataKey="variação">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry['variação'] >= 0 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceVariationChart;
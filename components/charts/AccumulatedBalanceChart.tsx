import React, { useMemo } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';
import { Occurrence, Settings, SkipData } from '../../types';
import { addMonthsSafe, parseDate, isSameYM, shortMonthLabel, fmtMoney } from '../../utils/helpers';

interface AccumulatedBalanceChartProps {
  allOccurrences: Occurrence[];
  skips: SkipData;
  settings: Settings;
  cursor: Date;
  months?: number;
}

const AccumulatedBalanceChart: React.FC<AccumulatedBalanceChartProps> = ({ allOccurrences, skips, settings, cursor, months = 6 }) => {
  const data = useMemo(() => {
    const chartData = [];
    const occurrencesToConsider = allOccurrences.filter(occ => !skips[occ.id]);
    
    const firstMonthOfChart = addMonthsSafe(cursor, -(months - 1));
    firstMonthOfChart.setDate(1);
    firstMonthOfChart.setHours(0,0,0,0);

    let accumulatedBalance = occurrencesToConsider
      .filter(occ => parseDate(occ.dueDate) < firstMonthOfChart)
      .reduce((acc, occ) => acc + (occ.kind === 'receita' ? occ.value : -occ.value), 0);
    
    let lastMonthAccumulated = accumulatedBalance;

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = addMonthsSafe(cursor, -i);
      
      const monthOccurrences = occurrencesToConsider.filter(occ => isSameYM(parseDate(occ.dueDate), monthDate));

      const monthBalance = monthOccurrences.reduce((acc, occ) => acc + (occ.kind === 'receita' ? occ.value : -occ.value), 0);
      accumulatedBalance += monthBalance;

      let variation = 0;
      if (lastMonthAccumulated !== 0) {
          variation = ((accumulatedBalance - lastMonthAccumulated) / Math.abs(lastMonthAccumulated)) * 100;
      } else if (accumulatedBalance !== 0) {
          variation = accumulatedBalance > 0 ? 100 : -100;
      }

      chartData.push({ 
        month: shortMonthLabel(monthDate), 
        'Saldo Acumulado': accumulatedBalance,
        'Variação Mensal (%)': variation,
      });
      
      lastMonthAccumulated = accumulatedBalance;
    }
    return chartData;
  }, [allOccurrences, months, skips, cursor]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#3f3f46] rounded-lg p-3 text-sm text-zinc-800 dark:text-zinc-200">
          <p className="label text-zinc-600 dark:text-zinc-400 mb-2">{`${label}`}</p>
          {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.stroke || pld.fill }}>
              {`${pld.name}: `}
              {pld.dataKey === 'Saldo Acumulado' 
                ? fmtMoney(pld.value, settings.currency) 
                : `${pld.value.toFixed(2)}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const axisStrokeColor = settings.dark ? "#71717a" : "#a1a1aa";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Evolução e Variação do Saldo</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <XAxis dataKey="month" stroke={axisStrokeColor} fontSize={12} />
          <YAxis 
            yAxisId="left"
            stroke="#a855f7" 
            fontSize={12} 
            tickFormatter={(v: number) => fmtMoney(v, settings.currency)} 
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#2dd4bf"
            fontSize={12} 
            tickFormatter={(v: number) => `${v.toFixed(0)}%`} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="right" dataKey="Variação Mensal (%)" name="Variação Mensal (%)">
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry['Variação Mensal (%)'] >= 0 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
          <Line yAxisId="left" type="monotone" dataKey="Saldo Acumulado" name="Saldo Acumulado" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccumulatedBalanceChart;

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Settings } from '../../types';
import { fmtMoney } from '../../utils/helpers';

interface MonthBarChartProps {
  totalIn: number;
  totalOut: number;
  settings: Settings;
}

const MonthBarChart: React.FC<MonthBarChartProps> = ({ totalIn, totalOut, settings }) => {
  const data = [{ name: 'Receitas', valor: totalIn, color: '#10b981' }, { name: 'Despesas', valor: totalOut, color: '#ef4444' }];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm shadow-lg">
          <p className="label font-semibold text-zinc-100 mb-1">{label}</p>
          <p className="text-zinc-100">
            <span>{payload[0].name} : </span>
            <span className="font-medium">{fmtMoney(payload[0].value, settings.currency)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100">Receitas x Despesas (mês atual)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
          <YAxis stroke="#71717a" fontSize={12} tickFormatter={(v: number) => fmtMoney(v, settings.currency)} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(113, 113, 122, 0.2)' }} />
          <Bar dataKey="valor">
            {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthBarChart;
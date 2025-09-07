
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Settings } from '../../types';
import { fmtMoney } from '../../utils/helpers';
import { useLanguage } from '../LanguageProvider';

interface MonthBarChartProps {
  totalIn: number;
  totalOut: number;
  settings: Settings;
}

const MonthBarChart: React.FC<MonthBarChartProps> = ({ totalIn, totalOut, settings }) => {
  const { t, locale } = useLanguage();
  const data = [{ name: t('common.income'), value: totalIn }, { name: t('common.expenses'), value: totalOut }];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 text-sm shadow-lg">
          <p className="label font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{label}</p>
          <p className="text-zinc-900 dark:text-zinc-100">
            <span className="font-medium">{fmtMoney(payload[0].value, settings.currency, locale)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const axisStrokeColor = settings.dark ? "#71717a" : "#a1a1aa";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{t('dashboard.incomeVsExpenses')}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="gradientReceitasBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="gradientDespesasBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke={axisStrokeColor} fontSize={12} />
          <YAxis stroke={axisStrokeColor} fontSize={12} tickFormatter={(v: number) => fmtMoney(v, settings.currency, locale)} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(113, 113, 122, 0.2)' }} />
          <Bar dataKey="value">
            {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={index === 0 ? 'url(#gradientReceitasBar)' : 'url(#gradientDespesasBar)'} />))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthBarChart;

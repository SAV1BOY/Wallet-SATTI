import React, { useMemo } from 'react';
import { PieChart, Pie, ResponsiveContainer, Legend, Tooltip, Cell } from 'recharts';
import { Occurrence, Kind, Settings, Category } from '../../types';
import { fmtMoney } from '../../utils/helpers';

interface CategoryPieChartProps {
  occurrences: Occurrence[];
  kind: Kind;
  settings: Settings;
  categories: { receita: Category[], despesa: Category[] };
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ occurrences, kind, settings, categories }) => {
  const data = useMemo(() => {
    const totals: { [key: string]: { value: number; color: string; label: string } } = {};
    const categoryList = categories[kind];

    categoryList.forEach(cat => {
      totals[cat.id] = { value: 0, color: cat.color, label: cat.label };
    });

    occurrences.filter(occ => occ.kind === kind).forEach(occ => {
      const id = occ.category || `other_${kind}`;
      if (totals[id]) {
        totals[id].value += occ.value;
      } else { 
        // Fallback for uncategorized entries, though this should be rare
        const uncategorizedId = `other_${kind}`;
        if (!totals[uncategorizedId]) {
            const otherCat = categoryList.find(c => c.id === uncategorizedId);
            totals[uncategorizedId] = { value: 0, color: otherCat?.color || '#6b7280', label: otherCat?.label || 'Outros' };
        }
        totals[uncategorizedId].value += occ.value;
      }
    });
    return Object.entries(totals).filter(([, d]) => d.value > 0).map(([id, d]) => ({ name: d.label, value: d.value, color: d.color }));
  }, [occurrences, kind, categories]);

  if (data.length === 0) return null;

  const tooltipContentStyle = {
    backgroundColor: settings.dark ? '#18181b' : '#ffffff',
    border: `1px solid ${settings.dark ? '#3f3f46' : '#e4e4e7'}`,
    borderRadius: '0.5rem',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{kind === 'receita' ? 'Receitas' : 'Despesas'} por Categoria</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" labelLine={false} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
          </Pie>
          <Legend />
          <Tooltip formatter={(v: number) => fmtMoney(v, settings.currency)} contentStyle={tooltipContentStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
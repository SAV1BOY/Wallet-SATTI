
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, Legend, Cell, Sector } from 'recharts';
import { Occurrence, Kind, Settings, Category } from '../../types';

interface CategoryPieChartProps {
  occurrences: Occurrence[];
  kind: Kind;
  settings: Settings;
  categories: { receita: Category[], despesa: Category[] };
}

const renderActiveShape = (props: any, settings: Settings) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

    const textColor = settings.dark ? '#f4f4f5' : '#18181b';
    const subTextColor = settings.dark ? '#a1a1aa' : '#71717a';

    return (
      <g>
        <text x={cx} y={cy - 8} textAnchor="middle" fill={textColor} className="text-base font-semibold">
          {payload.name}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill={subTextColor} className="text-sm">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          cornerRadius={4}
        />
      </g>
    );
  };

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ occurrences, kind, settings, categories }) => {
  const [activeIndex, setActiveIndex] = useState<number>();

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

  // FIX: The `activeIndex` prop on the `recharts` `Pie` component is not recognized by TypeScript,
  // likely due to outdated or incorrect type definitions. To work around this without being able to
  // update dependencies, we cast the component to `any` to bypass the type check. This allows
  // the interactive hover effect (highlighting a pie slice) to function correctly.
  const PieComponent: any = Pie;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{kind === 'receita' ? 'Receitas' : 'Despesas'} por Categoria</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <PieComponent 
            data={data} 
            cx="50%" 
            cy="50%" 
            innerRadius={70}
            outerRadius={90}
            dataKey="value" 
            nameKey="name"
            activeIndex={activeIndex}
            activeShape={(props) => renderActiveShape(props, settings)}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
          </PieComponent>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;

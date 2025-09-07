
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, Legend, Cell, Sector } from 'recharts';
import { Occurrence, Kind, Settings, Category } from '../../types';
import { useLanguage } from '../LanguageProvider';

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
  const { t } = useLanguage();

  const data = useMemo(() => {
    const totals: { [key: string]: { value: number; color: string; label: string } } = {};
    const categoryList = categories[kind];

    categoryList.forEach(cat => {
      const key = `categories.${kind}.${cat.id}`;
      const translated = t(key);
      const label = translated === key ? cat.label : translated;
      totals[cat.id] = { value: 0, color: cat.color, label };
    });

    occurrences.filter(occ => occ.kind === kind).forEach(occ => {
      const id = occ.category || `other_${kind}`;
      if (totals[id]) {
        totals[id].value += occ.value;
      } else { 
        const uncategorizedId = `other_${kind}`;
        if (!totals[uncategorizedId]) {
            const otherCat = categoryList.find(c => c.id === uncategorizedId);
            const key = `categories.${kind}.other_${kind}`;
            const translated = t(key);
            const label = translated === key ? (otherCat?.label || t('common.other')) : translated;
            totals[uncategorizedId] = { value: 0, color: otherCat?.color || '#6b7280', label };
        }
        totals[uncategorizedId].value += occ.value;
      }
    });
    return Object.entries(totals).filter(([, d]) => d.value > 0).map(([, d]) => ({ name: d.label, value: d.value, color: d.color }));
  }, [occurrences, kind, categories, t]);

  if (data.length === 0) return null;

  const PieComponent: any = Pie;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{kind === 'receita' ? t('dashboard.incomeByCategory') : t('dashboard.expensesByCategory')}</h3>
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
            activeShape={(props: any) => renderActiveShape(props, settings)}
            onMouseEnter={(_: any, index: number) => setActiveIndex(index)}
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

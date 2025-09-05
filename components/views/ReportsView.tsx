
import React, { useMemo } from 'react';
import { AppData, Occurrence, Settings, Category } from '../../types';
import { isSameYM, parseDate, fmtMoney, shortMonthLabel, monthLabel, overdueStatus } from '../../utils/helpers';
import { IconDollar, IconChart } from '../icons/Icon';

interface ReportsViewProps {
  allOccurrences: Occurrence[];
  cursor: Date;
  data: AppData;
  settings: Settings;
  categories: { receita: Category[], despesa: Category[] };
}

const ReportsView: React.FC<ReportsViewProps> = ({ allOccurrences, cursor, data, settings, categories }) => {
  const { skips, payments } = data;

  const occurrences = useMemo(() => {
    return allOccurrences
      .filter(o => isSameYM(parseDate(o.dueDate), cursor))
      .filter(o => !skips?.[o.id]);
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
      .filter(o => parseDate(o.dueDate) <= untilCursor && !skips?.[o.id])
      .forEach(o => {
        balance += o.kind === 'receita' ? o.value : -o.value;
      });
    return balance;
  }, [allOccurrences, skips, cursor]);

  const finalProjectedBalance = useMemo(() => {
    let balance = 0;
    allOccurrences
      .filter(o => !skips?.[o.id])
      .forEach(o => {
        balance += o.kind === 'receita' ? o.value : -o.value;
      });
    return balance;
  }, [allOccurrences, skips]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4">Visão Geral Financeira</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/80">
            <IconDollar size={32} className="mx-auto mb-2 text-cyan-400" />
            <div className="text-2xl font-bold text-cyan-400">{fmtMoney(accumulatedBalance, settings.currency)}</div>
            <div className="text-sm text-cyan-300">Saldo Acumulado até {shortMonthLabel(cursor)}</div>
          </div>
          <div className="text-center p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/80">
            <IconChart size={32} className="mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-purple-400">{fmtMoney(finalProjectedBalance, settings.currency)}</div>
            <div className="text-sm text-purple-300">Saldo Projetado (5 anos)</div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4">Resumo Mensal - {monthLabel(cursor)}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-900/20 rounded-xl border border-emerald-800/30">
            <div className="text-2xl font-bold text-emerald-400">{fmtMoney(totals.inc, settings.currency)}</div>
            <div className="text-sm text-emerald-300">Total Receitas</div>
          </div>
          <div className="text-center p-4 bg-rose-900/20 rounded-xl border border-rose-800/30">
            <div className="text-2xl font-bold text-rose-400">{fmtMoney(totals.exp, settings.currency)}</div>
            <div className="text-sm text-rose-300">Total Despesas</div>
          </div>
          <div className={`text-center p-4 rounded-xl border ${totals.bal >= 0 ? "bg-cyan-900/20 border-cyan-800/30" : "bg-orange-900/20 border-orange-800/30"}`}>
            <div className={`text-2xl font-bold ${totals.bal >= 0 ? "text-cyan-400" : "text-orange-400"}`}>{fmtMoney(totals.bal, settings.currency)}</div>
            <div className={`text-sm ${totals.bal >= 0 ? "text-cyan-300" : "text-orange-300"}`}>Saldo do Mês</div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4">Detalhamento por Categoria</h3>
        <div className="space-y-6">
          <CategoryBreakdown title="Receitas" kind="receita" totalKind={totals.inc} occurrences={occurrences} settings={settings} categories={categories.receita} />
          <CategoryBreakdown title="Despesas" kind="despesa" totalKind={totals.exp} occurrences={occurrences} settings={settings} categories={categories.despesa} />
        </div>
      </div>
      
      <PaymentStatusSection occurrences={occurrences} payments={payments} />

      <OverdueSection occurrences={occurrences} payments={payments} settings={settings} />
    </div>
  );
};

interface BreakdownProps {
    title: string;
    kind: 'receita' | 'despesa';
    totalKind: number;
    occurrences: Occurrence[];
    settings: Settings;
    categories: Category[];
}

const CategoryBreakdown: React.FC<BreakdownProps> = ({title, kind, totalKind, occurrences, settings, categories}) => (
  <div>
    <h4 className={`text-sm font-medium mb-3 ${kind === 'receita' ? 'text-emerald-400' : 'text-rose-400'}`}>{title}</h4>
    <div className="space-y-2">
      {categories.map(cat => {
        const total = occurrences.filter(o => o.kind === kind && o.category === cat.id).reduce((sum, o) => sum + o.value, 0);
        if (total === 0) return null;
        const percentage = totalKind > 0 ? (total / totalKind) * 100 : 0;
        return (
          <div key={cat.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{cat.icon}</span>
              <span className="text-sm">{cat.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-zinc-400 w-12 text-right">{percentage.toFixed(1)}%</div>
              <div className="font-medium w-24 text-right">{fmtMoney(total, settings.currency)}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const PaymentStatusSection: React.FC<{occurrences: Occurrence[], payments: AppData['payments']}> = ({occurrences, payments}) => {
    const paidCount = occurrences.filter(o => payments[`paid:${o.id}`]).length;
    const pendingCount = occurrences.length - paidCount;

    return (
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h3 className="text-lg font-semibold mb-4">Status de Pagamentos</h3>
            <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-emerald-900/20 rounded-xl border border-emerald-800/30">
                <div className="text-2xl font-bold text-emerald-400">{paidCount}</div>
                <div className="text-sm text-emerald-300">Pagos</div>
            </div>
            <div className="text-center p-4 bg-amber-900/20 rounded-xl border border-amber-800/30">
                <div className="text-2xl font-bold text-amber-400">{pendingCount}</div>
                <div className="text-sm text-amber-300">Pendentes</div>
            </div>
            </div>
      </div>
    );
};


const OverdueSection: React.FC<{occurrences: Occurrence[], payments: AppData['payments'], settings: Settings}> = ({occurrences, payments, settings}) => {
    const overdue = occurrences.filter(o => overdueStatus(o.dueDate) === 'overdue' && !payments[`paid:${o.id}`]);
    if (overdue.length === 0) return null;
    return (
      <div className="bg-rose-900/20 rounded-2xl p-4 border border-rose-800/30">
        <h3 className="text-lg font-semibold mb-4 text-rose-400">⚠️ Lançamentos Vencidos</h3>
        <div className="space-y-2">
          {overdue.map(o => {
            const daysOverdue = Math.floor((new Date().getTime() - parseDate(o.dueDate).getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div key={o.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium">{o.description}</div>
                  <div className="text-xs text-rose-400">Vencido há {daysOverdue} dia{daysOverdue !== 1 ? 's' : ''}</div>
                </div>
                <div className="font-semibold text-rose-400">{fmtMoney(o.value, settings.currency)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
};


export default ReportsView;